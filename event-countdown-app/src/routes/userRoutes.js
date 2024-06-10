const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = new express.Router();

// Register a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    user.password = hashedPassword;
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log('Error registering user:', error);
    res.status(400).send(error);
  }
});

// Login a user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log('Login error:', error); // Add this line for logging
    res.status(400).send({ error: error.message }); // Send the actual error message
  }
});

module.exports = router;
