// Vercel serverless entry point
const server = require('./server');

// Export the Express app as a serverless function
module.exports = (req, res) => {
  // Log incoming requests
  console.log(`[Vercel Serverless] ${req.method} ${req.url}`);
  
  // Handle the request with our Express app
  server(req, res);
};
