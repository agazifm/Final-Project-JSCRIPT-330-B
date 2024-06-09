const request = require('supertest');
const app = require('../src/app'); // Adjust the path to your app entry point
const User = require('../src/models/user');
const { setupDatabase, userOne } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('User Routes', () => {
  it('should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'MyPass777!'
      })
      .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).toBeTruthy();
    expect(user.email).toBe('newuser@example.com');
  });

  it('should login an existing user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    const user = await User.findById(userOne._id);
    expect(response.body.token).toBe(user.tokens[1].token);
  });

  it('should not login a non-existent user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'doesnotexist'
      })
      .expect(400);
  });
});
