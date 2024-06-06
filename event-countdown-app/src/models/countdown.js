const mongoose = require('mongoose');

const countdownSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

countdownSchema.index({ title: 'text', description: 'text' });

const Countdown = mongoose.model('Countdown', countdownSchema);
module.exports = Countdown;
