const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/user');
const Countdown = require('../src/models/countdown');
const Category = require('../src/models/category');

// Polyfill for TextEncoder and TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// User data for tests
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'User One',
  email: 'userone@example.com',
  password: '56what!!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

// Test setup
beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  await new User(userOne).save();
});

test('Should create a new countdown', async () => {
  const category = new Category({
    name: 'Test Category',
    owner: userOneId
  });
  await category.save();

  const response = await request(app)
    .post('/countdowns')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: 'New Countdown',
      description: 'Description of new countdown',
      date: new Date(),
      categoryId: category._id
    })
    .expect(201);

  const countdown = await Countdown.findById(response.body._id);
  expect(countdown).not.toBeNull();
  expect(countdown.title).toBe('New Countdown');
});

test('Should get all countdowns for user', async () => {
  const category = new Category({
    name: 'Test Category',
    owner: userOneId
  });
  await category.save();

  await new Countdown({
    title: 'Countdown One',
    description: 'Description for countdown one',
    date: new Date(),
    categoryId: category._id,
    owner: userOneId
  }).save();

  const response = await request(app)
    .get('/countdowns')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(1);
  expect(response.body[0].title).toBe('Countdown One');
});

test('Should delete a countdown', async () => {
  const category = new Category({
    name: 'Test Category',
    owner: userOneId
  });
  await category.save();

  const countdown = await new Countdown({
    title: 'Countdown One',
    description: 'Description for countdown one',
    date: new Date(),
    categoryId: category._id,
    owner: userOneId
  }).save();

  await request(app)
    .delete(`/countdowns/${countdown._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const deletedCountdown = await Countdown.findById(countdown._id);
  expect(deletedCountdown).toBeNull();
});
