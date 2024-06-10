const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/category');

// Create a new category
router.post('/categories', auth, async (req, res) => {
  console.log('Request to create category:', req.body); // Log the request body
  const category = new Category({
    ...req.body,
    owner: req.user._id
  });

  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    console.error('Error creating category:', e); // Log the full error
    res.status(400).send({ error: e.message });
  }
});


// Get all categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user._id });
    res.send(categories);
  } catch (e) {
    res.status(500).send();
  }
});

// Update a category
router.patch('/categories/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const category = await Category.findOne({ _id: req.params.id, owner: req.user._id });

    if (!category) {
      return res.status(404).send();
    }

    updates.forEach(update => category[update] = req.body[update]);
    await category.save();
    res.send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete category and associated countdowns
router.delete('/categories/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findOneAndDelete({ _id, owner: req.user._id });
    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    // Delete associated countdowns
    await Countdown.deleteMany({ categoryId: _id, owner: req.user._id });

    res.send({ message: 'Category and associated events deleted successfully' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
module.exports = router;