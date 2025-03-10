// Vercel build script for monorepo
const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Starting build process for monorepo...');
  
  // Install dependencies for both frontend and server
  console.log('Installing dependencies...');
  execSync('npm run install:all', { stdio: 'inherit' });
  
  // Build frontend
  console.log('Building frontend...');
  execSync('cd frontend && node build-simple.js', { stdio: 'inherit' });
  
  // Build server
  console.log('Building server...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
