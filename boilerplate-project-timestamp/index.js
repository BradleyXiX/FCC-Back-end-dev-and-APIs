// index.js
// Required modules
const express = require('express');
const app = express();
const cors = require('cors');

// Basic Configuration
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Root route that serves the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint for timestamp microservice
app.get('/api/:date?', (req, res) => {
  let date;
  const dateParam = req.params.date;
  
  // Case 1: No date parameter (should return current time)
  if (!dateParam) {
    date = new Date();
  } 
  // Case 2: Unix timestamp (numeric string)
  else if (/^\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam));
  } 
  // Case 3: Date string
  else {
    date = new Date(dateParam);
  }
  
  // Check if date is valid
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: "Invalid Date" });
  }
  
  // Return JSON with unix timestamp and UTC string
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Listen on the specified port
app.listen(port, () => {
  console.log(`Timestamp Microservice is listening on port ${port}`);
});