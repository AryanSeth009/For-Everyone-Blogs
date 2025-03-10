// Simple build script using ES Modules syntax
import { execSync } from 'child_process';

try {
  console.log('Starting Vite build process...');
  
  // Run the build using the locally installed vite
  console.log('Running vite build...');
  execSync('npx --no vite build', { 
    stdio: 'inherit'
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
