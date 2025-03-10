// Simple build script that uses the path to vite
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  console.log('Starting Vite build process...');
  
  // Get current directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Run the build using npx with the full path to node_modules/.bin/vite
  console.log('Running vite build...');
  execSync('npx --no -- vite build', { 
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
