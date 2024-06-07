const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

// Compound unique index for name and owner
categorySchema.index({ name: 1, owner: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
