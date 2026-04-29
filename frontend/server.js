const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Proxy API requests to our Go Backend
// In production, we typically don't run the backend on localhost:8080.
// We use an environment variable API_URL so Docker can tell us where the backend lives.
const API_URL = process.env.API_URL || 'http://localhost:8080';

app.use(
  '/api',
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // remove /api from the URL before sending to Go
    },
  })
);

// 2. Serve static files from the React build output (dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Handle React Router (Client-side routing)
// If the user requests any path (like /cart) that isn't a static file,
// send them index.html and let React Router handle it.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Proxying /api requests to ${API_URL}`);
});
