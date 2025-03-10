// Simple build script that uses the path to vite
const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Starting Vite build process...');
  
  // No need to get current directory in CommonJS as __dirname is already available
  
  // Run the build using npx with the full path to node_modules/.bin/vite
  console.log('Running vite build...');
  execSync('npx --yes vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `${path.resolve(__dirname, 'node_modules', '.bin')}:${process.env.PATH}`
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
