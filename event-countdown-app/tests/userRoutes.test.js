const request = require('supertest');
const app = require('../src/app'); // Ensure this path is correct
const User = require('../src/models/user');

let newUser;

beforeEach(async () => {
  await User.deleteMany();
  newUser = new User({
    name: 'User One',
    email: 'userone@example.com',
    password: 'MyPass777!',
  });
  await newUser.save();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('User Routes', () => {
  it('should register a new user', async () => {
    const email = 'newuser@example.com';
    const password = 'password123';

    const response = await request(app).post('/users').send({
      name: 'New User',
      email,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');

    const user = await User.findOne({ email });
    expect(user).not.toBeNull();
  });

  it('should login an existing user', async () => {
    console.log('newUser in test:', newUser); // Add this line for debugging

    const response = await request(app).post('/users/login').send({
      email: newUser.email,
      password: 'MyPass777!',
    });

    console.log('Login response body:', response.body); // Add this line for debugging

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});