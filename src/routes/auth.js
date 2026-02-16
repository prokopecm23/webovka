const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '../db.json');

function getDb() {
  return JSON.parse(fs.readFileSync(dbPath));
}
function saveDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

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

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = { username };
    res.redirect('/notepad');
  } else {
    res.redirect('/login?error=1');
  }
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  if (db.users.find(u => u.username === username)) {
    return res.redirect('/register?error=1');
  }
  db.users.push({ username, password, notes: [] });
  saveDb(db);
  req.session.user = { username };
  res.redirect('/notepad');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
module.exports.ensureLoggedIn = ensureLoggedIn;
