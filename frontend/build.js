// Simple build script to work around permission issues
const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Starting Vite build process...');
  
  // Get the path to vite.js
  const vitePath = path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  console.log(`Vite path: ${vitePath}`);
  
  // Execute the build command
  execSync(`node "${vitePath}" build`, { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
