const express = require('express');
const Countdown = require('../models/countdown');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create a new countdown
router.post('/countdowns', auth, async (req, res) => {
  const countdown = new Countdown({
    ...req.body,
    owner: req.user._id
  });
  console.log('Creating countdown:', countdown); // Add this line to log the countdown being created

  try {
    await countdown.save();
    res.status(201).send(countdown);
  } catch (e) {
    res.status(400).send(e);
  }
});


// Read all Countdowns
router.get('/countdowns', auth, async (req, res) => {
  const { categoryId } = req.query;
  const query = { owner: req.user._id };
  if (categoryId) {
    query.categoryId = categoryId;
  }
  console.log('Query:', query); // This should log the query being executed
  try {
    const countdowns = await Countdown.find(query);
    console.log('Populated countdowns:', countdowns); // This should log the countdowns returned by the query
    res.send(countdowns);
  } catch (e) {
    res.status(500).send();
  }
});



// Read Countdown by ID
router.get('/countdowns/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const countdown = await Countdown.findOne({ _id, owner: req.user._id });
    if (!countdown) {
      return res.status(404).send();
    }
    res.send(countdown);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Countdown
router.patch('/countdowns/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'date', 'categoryId'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const countdown = await Countdown.findOne({ _id: req.params.id, owner: req.user._id });
    if (!countdown) {
      return res.status(404).send();
    }

    updates.forEach((update) => (countdown[update] = req.body[update]));
    await countdown.save();
    res.send(countdown);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete Countdown
router.delete('/countdowns/:id', auth, async (req, res) => {
  try {
    const countdown = await Countdown.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!countdown) {
      return res.status(404).send();
    }
    res.send(countdown);
  } catch (e) {
    res.status(500).send();
  }
});


module.exports = router;
