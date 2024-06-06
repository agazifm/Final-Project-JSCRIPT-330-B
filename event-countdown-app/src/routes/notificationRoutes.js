const express = require('express');
const Notification = require('../models/notification');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create Notification
router.post('/notifications', auth, async (req, res) => {
  const notification = new Notification({
    ...req.body,
    owner: req.user._id
  });
  try {
    await notification.save();
    res.status(201).send(notification);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read all Notifications or by Countdown ID
router.get('/notifications', auth, async (req, res) => {
  const { countdownId } = req.query;
  try {
    const query = { owner: req.user._id };
    if (countdownId) {
      query.countdownId = countdownId;
    }
    const notifications = await Notification.find(query);
    res.send(notifications);
  } catch (e) {
    res.status(500).send();
  }
});

// Read Notification by ID
router.get('/notifications/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const notification = await Notification.findOne({ _id, owner: req.user._id });
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Notification
router.patch('/notifications/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['message', 'time', 'countdownId'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const notification = await Notification.findOne({ _id, owner: req.user._id });
    if (!notification) {
      return res.status(404).send();
    }

    updates.forEach((update) => (notification[update] = req.body[update]));
    await notification.save();
    res.send(notification);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete Notification
router.delete('/notifications/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
