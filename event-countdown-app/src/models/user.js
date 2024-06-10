// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

userSchema.statics.findByCredentials = async (email, password) => {
  console.log('Email:', email);
  console.log('Password:', password);
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found with email:', email);
    throw new Error('Unable to login');
  }
  console.log('Stored hashed password:', user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecret);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.validate = function() {
  const user = this;
  const errors = user.validateSync();
  if (errors) {
    throw new Error(errors.message);
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
