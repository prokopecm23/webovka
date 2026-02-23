const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notepad.html'));
});

router.get('/data', async (req, res) => {
  const User = req.app.get('UserModel');
  const user = await User.findOne({ username: req.session.user.username });
  res.json({ notes: user ? user.notes : [] });
});

router.post('/save', async (req, res) => {
  const { notes } = req.body;
  const User = req.app.get('UserModel');
  const user = await User.findOne({ username: req.session.user.username });
  if (user) {
    user.notes = notes;
    await user.save();
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
