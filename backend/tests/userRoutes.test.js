const request = require('supertest');
const app = require('../index');
const userDB = require('../db/userCRUD');

const {exampleUser1, exampleUser2} = require('../db/exampleUsers')

let testJWT;

/**
 *  To run the tests in this file, please first run 'node backend/db/populate-test-db.js
 *  
 *  This ensures that the necessary records are created in the test db in order to test
 *  the json data returned by the controllers
 * 
 *  These are two examples of users' records that will be populated in the db
    (they have been imported as exampleUser1 and exampleUser2 above): 
    {
        user_id: 1,
        name: 'Kelly',
        handle: '@kelly',
        bio: '',
        profile_pic_url: '',
        banner_pic_url: '',
        date_joined: new Date('2025-01-01')
    }

    {
        user_id: 2,
        name: 'Kevin',
        handle: '@kevin',
        bio: '',
        profile_pic_url: '',
        banner_pic_url: '',
        date_joined: new Date('2025-01-01'),
    }

 *  When finished testing you can run 'node backend/db/reset-test-db.js' to clear all
 *  test tables of their records
 * 
 */


describe("Setup tests (must be done before any other tests)", () => {
  // skip this test if you've already ran this test file once and the user "test" has been created
  // otherwise, do not skip this test on first run
  test.skip("create a new user", done => {
    request(app)
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
      request.agent(app)
      .put(`/users/${userTest.user_id}`)
      .auth(testJWT, {type: 'bearer'})
      .type('form')
      .send({
        name: '123test',
        profile_pic_url: 'abc',
        banner_pic_url: 'abc',
        bio: 'idk'
      })
      .expect("Content-Type", /json/)
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

  test("get /users/1/following returns a list of users that user_id:1 is following", done => {
    request.agent(app)
    .get("/users/1/following")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect([{followed_user: {...exampleUser2, date_joined: '2025-01-01T00:00:00.000Z'}}])
    .expect(200, done);
  });

  test("get /users/1/profile returns object with profile-related data", done => {
    request.agent(app)
    .get("/users/1/profile")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({
      "userInfo":{"user_id":1,"name":"Kelly","handle":"@kelly","bio":"","profile_pic_url":"","banner_pic_url":"","date_joined":"2025-01-01T00:00:00.000Z"},
      "following":[{"followed_user":{"user_id":2,"name":"Kevin","handle":"@kevin","bio":"","profile_pic_url":"","banner_pic_url":"","date_joined":"2025-01-01T00:00:00.000Z"}}],
      "likedPosts":[{
        "post":{
          "post_id":2,
          "content":"Hello World 2",
          "date_created":"2025-01-01T00:00:00.000Z",
          "author":{"user_id":2,"name":"Kevin","handle":"@kevin","profile_pic_url":""},
          "numLikes":1,"numReplies":4,"numReposts":1
        }}],
      "userPosts":{"name":"Kelly","username":"@kelly","profile_pic_url":"",
        "posts":[
          {
          "parent_post":{"post_id":2,"content":"Hello World 2","date_created":"2025-01-01T00:00:00.000Z",
            "author":{"user_id":2,"name":"Kevin","handle":"@kevin","profile_pic_url":""}},
          "numLikes":1,"numReposts":1,"numReplies":4
          },
          {
            "post_id":1,"author_id":1,"date_created":"2025-01-01T00:00:00.000Z","content":"Hello World",
            "numLikes":0,"numReposts":1,"numReplies":0
      }]},
        "userReplies":{"name":"Kelly","username":"@kelly",
          "replies":[
            {
              "reply_post":{"post_id":3,"author_id":1,"date_created":"2025-01-01T00:00:00.000Z","content":"I like this post"},
              "parent_post":{"post_id":2,"author":{"name":"Kevin","handle":"@kevin","user_id":2}},
              "numLikes":0,"numReposts":0,"numReplies":2
            },
            {
              "reply_post":{"post_id":4,"author_id":1,"date_created":"2025-01-01T00:00:00.000Z","content":"I forgot to mention, this post rocks"},
              "parent_post":{"post_id":2,"author":{"name":"Kevin","handle":"@kevin","user_id":2}},"numLikes":0,"numReposts":0,"numReplies":0
            },
            {
              "reply_post":{"post_id":6,"author_id":1,"date_created":"2025-01-01T00:00:00.000Z","content":"No problem"},
              "parent_post":{"post_id":5,"author":{"name":"Kevin","handle":"@kevin","user_id":2}},"numLikes":0,"numReposts":0,"numReplies":0
            }
          ]
        }
      }
    )
    .expect(200, done);
  });
});



describe('GET tests for /users/:user_id/posts path (protected routes as well', () => {
  test("posts prop should be empty array for @test, since they haven't created any posts", done => {
    userDB.getUserByHandle({handle: '@test'}).then((userTest) => {
      request.agent(app)
      .get(`/users/${userTest.user_id}/posts`)
      .auth(testJWT, {type: 'bearer'})
      .expect("Content-Type", /json/)
      .expect({
        name: "123test",
        username: "@test",
        profile_pic_url: "abc",
        posts: []
      })
      .expect(200, done);
    });
  });

  test("replies prop should be empty array for @test, since they haven't created any replies", done => {
    userDB.getUserByHandle({handle: '@test'}).then((userTest) => {
      request.agent(app)
      .get(`/users/${userTest.user_id}/posts/replies`)
      .auth(testJWT, {type: 'bearer'})
      .expect("Content-Type", /json/)
      .expect({
        name: "123test",
        username: "@test",
        replies: []
      })
      .expect(200, done);
    });
  });
});



describe.skip('POST/other tests for paths under /users', () => {
  
});



describe('Security tests', () => {
  test("Successfully log out as @test user", done => {
    setTimeout(() => {
      request.agent(app)
      .post("/users/logout")
      .auth(testJWT, {type: 'bearer'})
      .expect("Content-Type", /json/)
      .expect({logoutSuccess: true})
      .expect(200, done)
      }, 1000);
  });

  test("Prevent reuse of token that was issued before @test logged out", done => {
    request.agent(app)
    .get("/users/1/profile")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({error: "An error has occurred."})
    .expect(400, done);
  });

  test("send back errors for invalid inputs when creating new user", done => {
    request(app)
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
  