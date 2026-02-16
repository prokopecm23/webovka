const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { ensureLoggedIn } = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple JSON file database
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'notepad_secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/auth'));
app.use('/notepad', ensureLoggedIn, require('./routes/notepad'));

app.listen(PORT, () => {
  console.log(`Notepad app running at http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createGame, handlePlayerAction, getGameState } = require('./game/game');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory game sessions
const sessions = {};

app.post('/api/new', (req, res) => {
  const id = uuidv4();
  sessions[id] = createGame();
  res.json({ id });
});

app.post('/api/action', (req, res) => {
  const { id, action } = req.body;
  if (!sessions[id]) return res.status(404).json({ error: 'Session not found' });
  handlePlayerAction(sessions[id], action);
  res.json(getGameState(sessions[id]));
});

app.get('/api/state', (req, res) => {
  const { id } = req.query;
  if (!sessions[id]) return res.status(404).json({ error: 'Session not found' });
  const state = getGameState(sessions[id]);
  console.log('DEBUG /api/state response:', JSON.stringify(state));
  res.json(state);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`\nStealth Roguelike running at http://localhost:${PORT}\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use. The app could not start.\n`);
  } else {
    console.error(`\nServer error: ${err.message}\n`);
  }
});

// Gracefully close server on exit/signals
function shutdown() {
  server.close(() => {
    console.log('Server closed. Port freed.');
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
