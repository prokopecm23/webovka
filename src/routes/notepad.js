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

router.get('/', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.username === req.session.user.username);
  res.sendFile(path.join(__dirname, '../public/notepad.html'));
});

router.get('/data', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.username === req.session.user.username);
  res.json({ notes: user ? user.notes : [] });
});

router.post('/save', (req, res) => {
  const { notes } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.username === req.session.user.username);
  if (user) {
    user.notes = notes;
    saveDb(db);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
