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

// Text index for title and description for text search
countdownSchema.index({ title: 'text', description: 'text' });
// Index for date for performance
countdownSchema.index({ date: 1 });
// Unique index for title within the same owner
countdownSchema.index({ title: 1, owner: 1 }, { unique: true });

const Countdown = mongoose.model('Countdown', countdownSchema);
module.exports = Countdown;
