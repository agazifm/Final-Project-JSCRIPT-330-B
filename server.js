// Import required modules
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Set the port for the server
const port = process.env.PORT || 5000;

// Create the server
const server = http.createServer(app);

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));
