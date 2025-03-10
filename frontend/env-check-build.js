// Script to check environment variables during build
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Checking environment variables for build...');

// Check .env.production file
const envProdPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envProdPath)) {
  const envProdContent = fs.readFileSync(envProdPath, 'utf8');
  console.log('.env.production file content:');
  console.log(envProdContent);
  
  // Check for placeholder value
  if (envProdContent.includes('your-vercel-app-name')) {
    console.error('ERROR: Found placeholder "your-vercel-app-name" in .env.production!');
    console.error('Fixing the .env.production file...');
    
    const fixedContent = envProdContent.replace(
      /VITE_SERVER_DOMAIN=https:\/\/your-vercel-app-name\.vercel\.app/g, 
      'VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app'
    );
    
    fs.writeFileSync(envProdPath, fixedContent, 'utf8');
    console.log('Fixed .env.production file:');
    console.log(fixedContent);
  }
} else {
  console.error('.env.production file does not exist!');
  console.log('Creating .env.production file...');
  
  fs.writeFileSync(
    envProdPath, 
    'VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app\n', 
    'utf8'
  );
  
  console.log('.env.production file created successfully.');
}

console.log('\nVerifying that Vite will use the correct environment variables...');

// Create a temporary file to test environment variable injection
const testFilePath = path.join(__dirname, 'src', 'env-test.js');
fs.writeFileSync(
  testFilePath,
  `console.log('VITE_SERVER_DOMAIN:', import.meta.env.VITE_SERVER_DOMAIN);\n`,
  'utf8'
);

console.log('Environment check completed. Please rebuild your application.');

// Clean up
fs.unlinkSync(testFilePath);
