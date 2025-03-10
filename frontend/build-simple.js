// Simple build script using ESM syntax
import { execSync } from 'child_process';

try {
  console.log('Starting Vite build process...');
  
  // Try using npx vite build directly
  execSync('npx vite build', { 
    stdio: 'inherit'
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
