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
