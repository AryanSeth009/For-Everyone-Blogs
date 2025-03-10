// Simple build script that ensures vite is installed
import { execSync } from 'child_process';

try {
  console.log('Starting Vercel build process...');
  
  // First, ensure vite is installed
  console.log('Installing vite...');
  execSync('npm install vite --no-save', { 
    stdio: 'inherit'
  });
  
  // Then run the build
  console.log('Running vite build...');
  execSync('npx vite build', { 
    stdio: 'inherit'
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
