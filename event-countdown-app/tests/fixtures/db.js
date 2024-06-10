const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Category = require('../../src/models/category');
const Countdown = require('../../src/models/countdown');
const request = require('supertest');
const app = require('../../src/app');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'User One',
  email: 'userone@example.com',
  password: 'MyPass777!', // Plain text password for login
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

let userOneToken;

const setupDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });

  await mongoose.connection.db.dropDatabase();

  const hashedPassword = await bcrypt.hash(userOne.password, 8);
  await new User({
      ...userOne,
      password: hashedPassword
  }).save();

  const response = await request(app).post('/users/login').send({
      email: userOne.email,
      password: userOne.password, // Send the plain text password
  });

  userOneToken = response.body.token;

  const category = await new Category({
      name: 'Existing Category',
      owner: userOne._id,
  }).save();

  const countdown = await new Countdown({
      title: 'Existing Countdown',
      description: 'This is an existing countdown',
      date: new Date(),
      categoryId: category._id,
      owner: userOne._id,
  }).save();
};

const tearDownDatabase = async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};

module.exports = {
  userOneId,
  userOne,
  userOneToken,
  setupDatabase,
  tearDownDatabase,
  User,
};
