const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Countdown = require('./countdown');

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
    minlength: 7,
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  countdowns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Countdown'
  }]
}, {
  timestamps: true
});

// ... existing methods for userSchema ...

const User = mongoose.model('User', userSchema);

module.exports = User;
