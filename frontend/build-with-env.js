// build-with-env.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build with environment variables check...');

// Check if .env.production exists
const envProdPath = path.join(__dirname, '.env.production');
if (!fs.existsSync(envProdPath)) {
  console.log('No .env.production file found, creating one...');
  fs.writeFileSync(
    envProdPath,
    'VITE_SERVER_DOMAIN=https://for-everyone-blogs.onrender.com\n'
  );
  console.log('.env.production file created successfully.');
} else {
  console.log('.env.production file exists, checking content...');
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  
  if (envContent.includes('your-vercel-app-name')) {
    console.log('Found placeholder in .env.production, updating...');
    const updatedContent = envContent.replace(
      /VITE_SERVER_DOMAIN=https:\/\/your-vercel-app-name\.vercel\.app/,
      'VITE_SERVER_DOMAIN=https://for-everyone-blogs.onrender.com'
    );
    fs.writeFileSync(envProdPath, updatedContent);
    console.log('.env.production updated successfully.');
  } else {
    console.log('.env.production content looks good.');
  }
}

// Ensure environment variable is set for the build process
process.env.VITE_SERVER_DOMAIN = 'https://for-everyone-blogs.onrender.com';

console.log('Environment variables set:');
console.log('VITE_SERVER_DOMAIN:', process.env.VITE_SERVER_DOMAIN);

// Install dependencies if needed
try {
  console.log('Checking for Vite installation...');
  // First try to install only the required build dependencies
  execSync('npm install --no-save vite @vitejs/plugin-react', { stdio: 'inherit' });
  console.log('Build dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install build dependencies:', error);
  try {
    console.log('Attempting full dependency installation...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('Full dependency installation successful!');
  } catch (installError) {
    console.error('Failed to install dependencies:', installError);
    process.exit(1);
  }
}

// Run the Vite build command with explicit path
try {
  console.log('Running Vite build...');
  // Use require.resolve to find the exact path to vite
  const vitePath = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  execSync(`node "${vitePath}" build`, { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
