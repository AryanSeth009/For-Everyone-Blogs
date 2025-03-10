// Simple build script to work around permission issues
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

try {
  console.log('Starting Vite build process...');
  
  // Get current directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Get the path to vite.js
  const vitePath = path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  console.log(`Vite path: ${vitePath}`);
  
  // Check if vite.js exists
  if (!fs.existsSync(vitePath)) {
    console.error('Vite executable not found at:', vitePath);
    console.log('Listing node_modules/vite/bin directory:');
    try {
      const binDir = path.resolve(__dirname, 'node_modules', 'vite', 'bin');
      if (fs.existsSync(binDir)) {
        console.log(fs.readdirSync(binDir));
      } else {
        console.log('bin directory does not exist');
      }
    } catch (e) {
      console.error('Error listing directory:', e);
    }
    
    // Try using npx as a fallback
    console.log('Trying to build with npx vite build...');
    execSync('npx vite build', { 
      stdio: 'inherit',
      cwd: __dirname
    });
  } else {
    // Execute the build command
    execSync(`node "${vitePath}" build`, { 
      stdio: 'inherit',
      cwd: __dirname
    });
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
