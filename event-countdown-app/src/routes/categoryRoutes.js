const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/category');

// Create a new category
router.post('/categories', auth, async (req, res) => {
  const category = new Category({
    ...req.body,
    owner: req.user._id
  });

  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e);
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

// Delete a category and associated countdowns
router.delete('/categories/:id', auth, async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Delete countdowns associated with the category
    await Countdown.deleteMany({ categoryId, owner: req.user._id });

    // Delete the category
    const category = await Category.findOneAndDelete({ _id: categoryId, owner: req.user._id });

    if (!category) {
      return res.status(404).send({ error: 'Category not found' });
    }

    res.send({ message: 'Category and associated countdowns deleted' });
  } catch (e) {
    res.status(500).send({ error: 'Failed to delete category' });
  }
});

module.exports = router;
