// Simple script to check environment variables
const fs = require('fs');
const path = require('path');

console.log('Checking environment variables...');

// Check .env.production file
const envProdPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envProdPath)) {
  const envProdContent = fs.readFileSync(envProdPath, 'utf8');
  console.log('.env.production file exists with content:');
  console.log(envProdContent);
  
  // Check for placeholder value
  if (envProdContent.includes('your-vercel-app-name')) {
    console.log('WARNING: Found placeholder "your-vercel-app-name" in .env.production!');
    console.log('This needs to be replaced with your actual Vercel domain.');
  }
} else {
  console.log('.env.production file does not exist!');
}

// Check if Vite will load the correct environment variables
console.log('\nVite will load these environment variables in production:');
console.log('VITE_SERVER_DOMAIN:', process.env.VITE_SERVER_DOMAIN || 'Not set in process.env');

console.log('\nRecommended action:');
console.log('1. Update .env.production with: VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app');
console.log('2. Make sure this file is included in your deployment');
