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
    'VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app\n'
  );
  console.log('.env.production file created successfully.');
} else {
  console.log('.env.production file exists, checking content...');
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  
  if (envContent.includes('your-vercel-app-name')) {
    console.log('Found placeholder in .env.production, updating...');
    const updatedContent = envContent.replace(
      /VITE_SERVER_DOMAIN=https:\/\/your-vercel-app-name\.vercel\.app/,
      'VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app'
    );
    fs.writeFileSync(envProdPath, updatedContent);
    console.log('.env.production updated successfully.');
  } else {
    console.log('.env.production content looks good.');
  }
}

// Ensure environment variable is set for the build process
process.env.VITE_SERVER_DOMAIN = 'https://for-everyone-blogs.vercel.app';

console.log('Environment variables set:');
console.log('VITE_SERVER_DOMAIN:', process.env.VITE_SERVER_DOMAIN);

// Run the Vite build command
try {
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
