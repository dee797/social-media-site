const request = require('supertest');
const app = require('../index');

const {exampleUser1, exampleUser2} = require('../db/exampleUsers')


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



describe('GET tests for /users/:user_id path', () => {
  test('get /users/2 gets user info', done => {
    request(app)
    .get("/users/2")
    .expect("Content-Type", /json/)
    .expect({...exampleUser2, date_joined: '2025-01-01T00:00:00.000Z'})
    .expect(200, done);
  });

  test("get /users/3 returns 404 as that user doesn't exist", done => {
    request(app)
    .get("/users/3")
    .expect("Content-Type", /json/)
    .expect({error: "404 - Not Found"})
    .expect(404, done);
  });

  test("get /users/1/following returns a list of users that user_id:1 is following", done => {
    request(app)
    .get("/users/1/following")
    .expect("Content-Type", /json/)
    .expect([{followed_user: {...exampleUser2, date_joined: '2025-01-01T00:00:00.000Z'}}])
    .expect(200, done);
  });

  test("get /users/1/profile returns object with profile-related data", done => {
    request(app)
    .get("/users/1/profile")
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
  test("create a new user", done => {
    request(app)
    .post("/users")
    .type("form")
    .send({
      username: "@test",
      password: "1234ThisIsAPassword!",
      confirmPassword: "1234ThisIsAPassword!",
      name: "test"
    })
    .expect("Content-Type", /json/)
    .expect({signupSuccess: true})
    .expect(201, done)
  })
})

