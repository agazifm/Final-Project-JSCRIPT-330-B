const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Category = require('../../src/models/category');
const Countdown = require('../../src/models/countdown');

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

const categoryOneId = new mongoose.Types.ObjectId();
const categoryOne = {
  _id: categoryOneId,
  name: 'Category One',
  owner: userOneId
};

const countdownOneId = new mongoose.Types.ObjectId();
const countdownOne = {
  _id: countdownOneId,
  title: 'Countdown One',
  description: 'Description for countdown one',
  date: new Date(),
  owner: userOneId,
  categoryId: categoryOneId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Category.deleteMany();
  await Countdown.deleteMany();
  await new User(userOne).save();
  await new Category(categoryOne).save();
  await new Countdown(countdownOne).save();
};

module.exports = {
  userOneId,
  userOne,
  categoryOneId,
  categoryOne,
  countdownOneId,
  countdownOne,
  setupDatabase
};
