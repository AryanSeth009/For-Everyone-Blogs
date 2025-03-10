// Simple CommonJS build script for Vite
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Starting Vite build process...');
  
  // Check if Vite exists in node_modules
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  const viteExists = fs.existsSync(vitePath);
  
  if (!viteExists) {
    console.log('Vite not found in node_modules, installing...');
    execSync('npm install --no-save vite@4.4.5', { stdio: 'inherit' });
  }
  
  // Run the build command
  console.log('Running Vite build...');
  
  // Try different approaches to run Vite
  try {
    // Approach 1: Use direct path to vite binary
    execSync(`${path.join(__dirname, 'node_modules', '.bin', 'vite')} build`, { 
      stdio: 'inherit' 
    });
  } catch (err) {
    console.log('First approach failed, trying alternative...');
    
    // Approach 2: Use node to run vite.js directly
    execSync(`node ${path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')} build`, { 
      stdio: 'inherit' 
    });
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
