const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const userRouter = require('./routes/userRoutes');
const countdownRouter = require('./routes/countdownRoutes');
const categoryRouter = require('./routes/categoryRoutes');

// Connect to MongoDB
mongoose.connect(config.dbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(countdownRouter);
app.use(categoryRouter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;
