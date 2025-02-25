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
      userInfo: {...exampleUser1, date_joined: '2025-01-01T00:00:00.000Z'},
      following: [{followed_user: {...exampleUser2, date_joined: '2025-01-01T00:00:00.000Z'}}],
      followers: [],
      likedPosts: [{ post: {
        post_id: 2,
        author: {user_id: 2, name: 'Kevin', handle: '@kevin', profile_pic_url: ''},
        content: 'Hello World 2',
        date_created: '2025-01-01T00:00:00.000Z',
        numLikes: 1,
        numReplies: 4,
        numReposts: 1
      }}]
    })
    .expect(200, done);
  });
});


describe('POST/other tests for paths under /users', () => {
  test("Update user info", done => {
    userDB.getUserByHandle({handle: '@test'}).then((userTest) => {
      request.agent(app)
      .put(`/users/${userTest.user_id}`)
      .auth(testJWT, {type: 'bearer'})
      .type('form')
      .send({
        name: '123test',
        username: '@kevin',
        profile_pic_url: 'abc',
        banner_pic_url: 'abc',
        bio: 'idk'
      })
      .expect("Content-Type", /json/)
      .expect({updateSuccess: true})
      .expect(200, done)
      });
  });

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
});


describe('Security tests', () => {
  test("Prevent reuse of token that was issued before @test logged out", done => {
    request.agent(app)
    .get("/users/1/profile")
    .auth(testJWT, {type: 'bearer'})
    .expect("Content-Type", /json/)
    .expect({error: "An error has occurred."})
    .expect(400, done);
  });
})
  