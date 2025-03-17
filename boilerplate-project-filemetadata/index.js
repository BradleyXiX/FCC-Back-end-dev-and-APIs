const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Basic Configuration
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Home page
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// File upload endpoint
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Extract file metadata
  const { originalname, mimetype, size } = req.file;

  // Return file metadata as JSON
  res.json({
    name: originalname,
    type: mimetype,
    size: size
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(process.cwd() + '/views/404.html');
});

// Start the server
app.listen(port, function() {
  console.log('Your app is listening on port ' + port);
});