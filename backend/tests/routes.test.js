const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const request = require('supertest');
const app = require('../index');
const userDB = require('../db/userCRUD');

const {exampleUser2} = require('../db/exampleUsers');

const populateTestDB = require("../db/populate-test-db");
const resetTestDB = require("../db/reset-test-db");

let testJWT;
let testUserID;


/**
 * To run the tests in this file, please comment out the line 
 * 'app.listen(PORT)' in the index.js file in order to prevent
 * Jest from hanging
 * 
 * This file will also throw the error "Invalid token". This is 
 * expected behavior
 */


beforeAll(async () => {
  return resetTestDB()
  .then(async () => {
      await prisma.$disconnect();
    })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
});


beforeAll(async () => {
  return populateTestDB()
  .then(async () => {
      await prisma.$disconnect();
    })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
});


afterAll(async () => {
  return resetTestDB()
  .then(async () => {
      await prisma.$disconnect();
    })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
});


describe("Setup tests (must be done before any other tests)", () => {
  test("create a new user", done => {
    request.agent(app)
    .post("/users")
    .type("form")
    .send({
      username: "test",
      password: "1234ThisIsAPassword!",
      confirmPassword: "1234ThisIsAPassword!",
      name: "test"
    })
    .expect("Content-Type", /json/)
    .expect({signupSuccess: true})
    .expect(201, done);
  });
  
  
  test("login successfully as user 'test'", done => {
    request.agent(app)
    .post("/users/login")
    .type("form")
    .send({
      username: "test",
      password: "1234ThisIsAPassword!"
    })
    .expect(200)
    .end((err, res) => {
      if (err) done(err);
      if (res.body.loginSuccess) {
        testJWT = res.body.token;
        done();
      }
    });
  });

  test("update user info", done => {
    userDB.getUserByHandle({handle: '@test'}).then((userTest) => {
      testUserID = userTest.user_id;
      
      request.agent(app)
      .put(`/users/${testUserID}`)
      .auth(testJWT, {type: 'bearer'})
      .type("form")
      .send({
        name: "123test",
        bio: "idk",
        profile_pic: "null",
        banner_pic: "null"
      })
      .expect({updateSuccess: true})
      .expect(200, done)
      });
  });
});



describe('GET tests for /users/:user_id path (these are all protected routes)', () => {
  test('get /users/2 gets user info', done => {
    request.agent(app)
    .get("/users/2")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({...exampleUser2, date_joined: '2025-01-01T00:00:00.000Z'})
    .expect(200, done);
  });

  test("get /users/3 returns 404 as that user doesn't exist", done => {
    request.agent(app)
    .get("/users/3")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({error: "404 - Not Found"})
    .expect(404, done);
  });

  test("get /users/1/following returns a list of users that @kelly is following", done => {
    request.agent(app)
    .get("/users/1/following")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect([{followed_user: {...exampleUser2, date_joined: '2025-01-01T00:00:00.000Z'}}])
    .expect(200, done);
  });

  test("get /users/kelly/profile returns object with profile-related data", done => {
    request.agent(app)
    .get("/users/kelly/profile")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({
      "userInfo":{"user_id":1,"name":"Kelly","handle":"@kelly","bio":"","profile_pic_url":"","banner_pic_url":"","date_joined": '2025-01-01T00:00:00.000Z'},
      "followers":[],
      "following":[{"followed_user":{"user_id":2,"name":"Kevin","handle":"@kevin","bio":"","profile_pic_url":"","banner_pic_url":"","date_joined": '2025-01-01T00:00:00.000Z'}
      }],
      "likedPosts":[{"post":{"post_id":2,"content":"Hello World 2","date_created": '2025-01-01T00:00:00.000Z',"author":{"user_id":2,"name":"Kevin","handle":"@kevin","profile_pic_url":""},"quote_parent":[],"reply_parent":[],"numLikes":1,"numReplies":4,"numReposts":1}
      }],
      "posts":[
        {"parent_post":{"post_id":2,"content":"Hello World 2","date_created": '2025-01-01T00:00:00.000Z',"author":{"user_id":2,"name":"Kevin","handle":"@kevin","profile_pic_url":""},"quote_parent":[],"reply_parent":[]},"numLikes":1,"numReposts":1,"numReplies":4,"author":{"name":"Kelly","handle":"@kelly","profile_pic_url":"","user_id":1}},
        {"post_id":1,"author_id":1,"date_created": '2025-01-01T00:00:00.000Z',"content":"Hello World","numLikes":0,"numReposts":1,"numReplies":0,"author":{"name":"Kelly","handle":"@kelly","profile_pic_url":"","user_id":1}
      }],
      "replies":[
        {"reply_post":{"post_id":3,"author_id":1,"date_created": '2025-01-01T00:00:00.000Z',"content":"I like this post"},"parent_post":{"post_id":2,"author":{"name":"Kevin","handle":"@kevin","user_id":2}},"numLikes":0,"numReposts":0,"numReplies":2,"author":{"name":"Kelly","handle":"@kelly","user_id":1,"profile_pic_url":""}},
        {"reply_post":{"post_id":4,"author_id":1,"date_created": '2025-01-01T00:00:00.000Z',"content":"I forgot to mention, this post rocks"},"parent_post":{"post_id":2,"author":{"name":"Kevin","handle":"@kevin","user_id":2}},"numLikes":0,"numReposts":0,"numReplies":0,"author":{"name":"Kelly","handle":"@kelly","user_id":1,"profile_pic_url":""}},
        {"reply_post":{"post_id":6,"author_id":1,"date_created": '2025-01-01T00:00:00.000Z',"content":"No problem"},"parent_post":{"post_id":5,"author":{"name":"Kevin","handle":"@kevin","user_id":2}},"numLikes":0,"numReposts":0,"numReplies":0,"author":{"name":"Kelly","handle":"@kelly","user_id":1,"profile_pic_url":""}}
      ]}
    )
    .expect(200, done);
  });
});



describe('GET tests for /users/:user_id/posts path (protected routes as well)', () => {
  test("should expect empty array for fetching posts, since @test hasn't created any posts", done => {
      request.agent(app)
      .get(`/users/${testUserID}/posts`)
      .auth(testJWT, {type: 'bearer'})
      .expect("Content-Type", /json/)
      .expect([])
      .expect(200, done);
  });

  test("should expect empty array for fetching replies, since @test hasn't created any replies", done => {
      request.agent(app)
      .get(`/users/${testUserID}/posts/replies`)
      .auth(testJWT, {type: 'bearer'})
      .expect("Content-Type", /json/)
      .expect([])
      .expect(200, done);
    });
});



describe('GET test for /search path', () => {
  test("gets a list of matching users for usernames that contain 'Ke'", done => {
    request.agent(app)
    .get("/search?handle=Ke")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect([
      { user_id: 1, name: 'Kelly', handle: '@kelly', profile_pic_url: '' },
      { user_id: 2, name: 'Kevin', handle: '@kevin', profile_pic_url: '' }
    ])
    .expect(200, done);
  });
});



describe('Security/Input validation tests', () => {
  test("Successfully log out as @test user", done => {
    setTimeout(() => {
      request.agent(app)
      .post(`/users/${testUserID}/logout`)
      .auth(testJWT, {type: 'bearer'})
      .expect("Content-Type", /json/)
      .expect({logoutSuccess: true})
      .expect(200, done)
      }, 1000);
  });

  // This test will log an error in the console with the message 'Invalid token'. This is expected behavior
  test("Prevent reuse of token that was issued before @test logged out", done => {
    request.agent(app)
    .get("/users/1")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({error: "An error has occurred."})
    .expect(401, done);
  });

  test("send back errors for invalid inputs when creating new user", done => {
    request.agent(app)
    .post("/users")
    .type("form")
    .send({
      username: "test",
      name: "This is a name that is more than 25 characters long",
      password: "a",
      confirmPassword: "Not a matching password"
    })
    .expect("Content-Type", /json/)
    .expect({
      validationErrors: {
        name: {
          type: 'field',
          value: 'This is a name that is more than 25 characters long',
          msg: 'Name cannot be more than 25 characters',
          path: 'name',
          location: 'body'
        },
        username: {
          type: 'field',
          value: 'test',
          msg: 'Username already in use.',
          path: 'username',
          location: 'body'
        },
        password: {
          type: 'field',
          value: 'a',
          msg: 'Password does not meet the requirements.',
          path: 'password',
          location: 'body'
        },
        confirmPassword: {
          type: 'field',
          value: 'Not a matching password',
          msg: 'Passwords do not match.',
          path: 'confirmPassword',
          location: 'body'
        }
      }
    })
    .expect(400, done);
  });
})
  