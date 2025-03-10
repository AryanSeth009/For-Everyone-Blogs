#!/bin/bash

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install Vite explicitly
echo "Installing Vite..."
npm install --no-save vite@4.4.5

# Run the build command
echo "Running Vite build..."
./node_modules/.bin/vite build

echo "Build completed!"
