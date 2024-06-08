const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/user');
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

test('Should create a new category', async () => {
  const response = await request(app)
    .post('/categories')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'New Category'
    })
    .expect(201);

  const category = await Category.findById(response.body._id);
  expect(category).not.toBeNull();
  expect(category.name).toBe('New Category');
});

test('Should get all categories for user', async () => {
  await new Category({
    name: 'Category One',
    owner: userOneId
  }).save();

  const response = await request(app)
    .get('/categories')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(1);
  expect(response.body[0].name).toBe('Category One');
});

test('Should delete a category', async () => {
  const category = await new Category({
    name: 'Category One',
    owner: userOneId
  }).save();

  await request(app)
    .delete(`/categories/${category._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const deletedCategory = await Category.findById(category._id);
  expect(deletedCategory).toBeNull();
});
