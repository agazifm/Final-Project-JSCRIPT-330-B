const express = require('express');
const Countdown = require('../models/countdown');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create Countdown
router.post('/countdowns', auth, async (req, res) => {
  const countdown = new Countdown({
    ...req.body,
    owner: req.user._id
  });
  try {
    await countdown.save();
    req.user.countdowns = req.user.countdowns.concat(countdown._id);
    await req.user.save();
    res.status(201).send(countdown);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read all Countdowns
router.get('/countdowns', auth, async (req, res) => {
  try {
    await req.user.populate('countdowns');
    console.log('Populated countdowns:', req.user.countdowns);  // Debugging log
    res.send(req.user.countdowns);
  } catch (e) {
    console.error(e);  // Error logging
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

// Search Countdowns
router.get('/countdowns/search/:query', auth, async (req, res) => {
  const query = req.params.query;
  try {
    const countdowns = await Countdown.find({ 
      $text: { $search: query }, 
      owner: req.user._id 
    });
    res.send(countdowns);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
