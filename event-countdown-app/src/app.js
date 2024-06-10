const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const userRouter = require('./routes/userRoutes');
const countdownRouter = require('./routes/countdownRoutes');
const categoryRouter = require('./routes/categoryRoutes');

// Determine MongoDB URI based on environment
let mongodbUri;
if (process.env.NODE_ENV === 'test') {
  mongodbUri = config.mongodbUriTest;
} else if (process.env.NODE_ENV === 'development') {
  mongodbUri = config.mongodbUriDev;
} else {
  mongodbUri = config.mongodbUri;
}

// Connect to MongoDB
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(countdownRouter);
app.use(categoryRouter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;
