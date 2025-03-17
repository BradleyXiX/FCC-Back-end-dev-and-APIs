// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');
const app = express();
const port = process.env.PORT || 3000;

// Basic Configuration
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store URLs in memory for simplicity (use a database in production)
const urlDatabase = [];

// Home Page
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Create short URL
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // Validate URL format
  try {
    const urlObject = new URL(originalUrl);

    // Check if URL has http/https protocol
    if (!urlObject.protocol.match(/^https?:$/)) {
      return res.json({ error: 'invalid url' });
    }

    // Extract hostname for DNS lookup
    const hostname = urlObject.hostname;

    // Verify hostname with DNS lookup
    dns.lookup(hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      // Check if URL already exists in our database
      const existingUrl = urlDatabase.find(item => item.original_url === originalUrl);

      if (existingUrl) {
        return res.json({
          original_url: existingUrl.original_url,
          short_url: existingUrl.short_url
        });
      }

      // Create new short URL
      const shortUrl = urlDatabase.length + 1;

      // Save to "database"
      urlDatabase.push({
        original_url: originalUrl,
        short_url: shortUrl
      });

      // Return JSON response
      return res.json({
        original_url: originalUrl,
        short_url: shortUrl
      });
    });
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }
});

// Redirect to original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = parseInt(req.params.short_url);

  // Find URL in "database"
  const urlData = urlDatabase.find(item => item.short_url === shortUrl);

  if (!urlData) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  // Redirect to original URL
  res.redirect(urlData.original_url);
});

// Start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});