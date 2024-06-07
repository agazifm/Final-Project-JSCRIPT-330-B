const mongoose = require('mongoose');
const config = require('./event-countdown-app/src/config'); // Adjust the path as needed

// Connect to MongoDB
mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Drop the categories collection
    mongoose.connection.db.dropCollection('categories', (err, result) => {
      if (err) {
        console.error('Error dropping collection:', err);
      } else {
        console.log('Categories collection dropped:', result);
      }
      mongoose.connection.close();
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
