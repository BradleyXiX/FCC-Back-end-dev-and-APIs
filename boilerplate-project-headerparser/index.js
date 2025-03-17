// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for FCC testing purposes
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// Serve static files
app.use(express.static('public'));

// Main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint
app.get('/api/whoami', (req, res) => {
  const ipaddress = req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress || 
                    req.connection.socket.remoteAddress;
  
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];
  
  res.json({ ipaddress, language, software });
});

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});