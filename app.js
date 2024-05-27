// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

// Initialize the Express application
const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());

// Import routes
const countdownRoutes = require('./routes/countdowns');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/countdowns', countdownRoutes);
app.use('/api/users', userRoutes);

// Export the app for use in server.js
module.exports = app;
