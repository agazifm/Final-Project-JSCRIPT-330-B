// Countdown model schema definition
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Countdown schema
const CountdownSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true }
});

// Export the Countdown model
module.exports = mongoose.model('Countdown', CountdownSchema);
