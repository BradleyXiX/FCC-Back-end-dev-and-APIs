const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Basic Configuration
const port = process.env.PORT || 3000;

// In-memory data stores
const users = [];
const exercises = [];

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create a new user
app.post('/api/users', (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.json({ error: "username is required" });
  }

  const newUser = {
    username: username,
    _id: users.length.toString()
  };

  users.push(newUser);
  res.json(newUser);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Add exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  // Find user
  const user = users.find(u => u._id === userId);

  if (!user) {
    return res.json({ error: "user not found" });
  }

  // Create exercise
  const exercise = {
    userId: userId,
    description: description,
    duration: parseInt(duration),
    date: date ? new Date(date) : new Date()
  };

  exercises.push(exercise);

  // Format response
  res.json({
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString()
  });
});

// Get user exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;
  let { from, to, limit } = req.query;

  // Find user
  const user = users.find(u => u._id === userId);

  if (!user) {
    return res.json({ error: "user not found" });
  }

  // Find user's exercises
  let userExercises = exercises.filter(e => e.userId === userId);

  // Apply date filters if provided
  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(e => e.date >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(e => e.date <= toDate);
  }

  // Apply limit if provided
  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  // Format log
  const log = userExercises.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  // Return response
  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log: log
  });
});

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});