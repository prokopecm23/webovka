const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ensureLoggedIn } = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notepad';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  notes: [String]
});
const User = mongoose.model('User', userSchema);

// Make User model available to routes
app.set('UserModel', User);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'notepad_secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/auth'));
app.use('/notepad', ensureLoggedIn, require('./routes/notepad'));

app.listen(PORT, () => {
  console.log(`Notepad app running at http://localhost:${PORT}`);
});
