const express = require('express');
const router = express.Router();
const path = require('path');


function ensureLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const User = req.app.get('UserModel');
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = { username };
    res.redirect('/notepad');
  } else {
    res.redirect('/login?error=1');
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const User = req.app.get('UserModel');
  const exists = await User.findOne({ username });
  if (exists) {
    return res.redirect('/register?error=1');
  }
  await User.create({ username, password, notes: [] });
  req.session.user = { username };
  res.redirect('/notepad');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
module.exports.ensureLoggedIn = ensureLoggedIn;
