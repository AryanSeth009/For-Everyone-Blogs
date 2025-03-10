const { execSync } = require('child_process');

try {
    // Install all dependencies including devDependencies
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Run the Vite build command
    console.log('Building the project...');
    execSync('npx --yes vite build', { stdio: 'inherit' });
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
