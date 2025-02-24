const request = require('supertest');
const app = require('../index');

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
        author_id: 2,
        content: 'Hello World 2',
        date_created: '2025-01-01T00:00:00.000Z'
      }}]
    })
    .expect(200, done);
  });
});



describe('POST or other related requests for /users path', () => {
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

