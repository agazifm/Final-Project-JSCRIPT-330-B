const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const userRouter = require('./routes/userRoutes');
const countdownRouter = require('./routes/countdownRoutes'); // Ensure this is correctly referenced
const categoryRouter = require('./routes/categoryRoutes');

// Connect to MongoDB
mongoose.connect(config.dbUri).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(countdownRouter); // Ensure this is included
app.use(categoryRouter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;
