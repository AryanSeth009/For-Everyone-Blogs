// Root API handler for Vercel
const server = require('../server/server');

// Export the Express app as a serverless function
module.exports = (req, res) => {
  // Log incoming requests
  console.log(`[Vercel API] ${req.method} ${req.url}`);
  
  // Handle the request with our Express app
  server(req, res);
};
