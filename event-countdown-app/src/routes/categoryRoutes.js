const express = require('express');
const Category = require('../models/category');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create Category
router.post('/categories', auth, async (req, res) => {
  const category = new Category({
    ...req.body,
    userId: req.user._id
  });
  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read all Categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.send(categories);
  } catch (e) {
    res.status(500).send();
  }
});

// Read Category by ID
router.get('/categories/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findOne({ _id, userId: req.user._id });
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Category
router.patch('/categories/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user._id });
    if (!category) {
      return res.status(404).send();
    }

    updates.forEach((update) => (category[update] = req.body[update]));
    await category.save();
    res.send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete Category
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
