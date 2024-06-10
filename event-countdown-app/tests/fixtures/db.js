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
  tokens: []
};

let userOneToken;
let category;

const setupDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mongoose.connection.db.dropDatabase();

  const hashedPassword = await bcrypt.hash(userOne.password, 8);
  const user = new User({
    ...userOne,
    password: hashedPassword
  });

  await user.save();

  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password,
  });

  userOneToken = response.body?.token; // Use optional chaining to ensure userOneToken is set if response.body is defined
  console.log('userOneToken:', userOneToken); // Log the token for debugging

  await User.updateOne({ _id: userOneId }, { $push: { tokens: { token: userOneToken } } });

  category = await new Category({
    name: 'Existing Category',
    owner: userOneId,
  }).save();

  console.log('category:', category?._id); // Log the category ID for debugging

  await new Countdown({
    title: 'Existing Countdown',
    description: 'This is an existing countdown',
    date: new Date(),
    categoryId: category?._id,
    owner: userOneId,
  }).save();

  return userOneToken; // Return the token
};

const tearDownDatabase = async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};

module.exports = {
  userOneId,
  userOne,
  setupDatabase,
  tearDownDatabase,
  User,
  category, // Export the category for use in tests
};
