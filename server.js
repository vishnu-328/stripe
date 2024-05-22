const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from a .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to enable CORS
app.use(cors());

// Import the checkout route
const checkoutRoute = require('./checkoutRoute');

// Use the checkout route
app.use('/api', checkoutRoute);

// Single route to handle both success and cancel pages
app.get('/:status', (req, res) => {
  const status = req.params.status;

  if (status === 'success') {
    const sessionId = req.query.session_id;
    res.send(`
      <html>
        <head>
          <title>Payment Successful</title>
        </head>
        <body>
          <h1>Payment Successful</h1>
          <p>Your payment was successful. Session ID: ${sessionId}</p>
        </body>
      </html>
    `);
  } else if (status === 'cancel') {
    res.send(`
      <html>
        <head>
          <title>Payment Cancelled</title>
        </head>
        <body>
          <h1>Payment Cancelled</h1>
          <p>Your payment was cancelled.</p>
        </body>
      </html>
    `);
  } else {
    res.status(404).send('Page not found');
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Catch-all route for undefined routes to help identify 404s
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
