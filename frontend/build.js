// Simple build script that uses the path to vite
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

try {
  console.log('Starting Vite build process...');
  
  // Determine path separator based on OS
  const pathSeparator = os.platform() === 'win32' ? ';' : ':';
  
  // Run the build using npx with the full path to node_modules/.bin/vite
  console.log('Running vite build...');
  execSync('npx --yes vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `${path.resolve(__dirname, 'node_modules', '.bin')}${pathSeparator}${process.env.PATH}`
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
