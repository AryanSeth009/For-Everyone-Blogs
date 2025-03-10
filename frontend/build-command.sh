#!/bin/bash

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Ensure Vite is installed
echo "Checking for Vite..."
if [ ! -f "./node_modules/.bin/vite" ]; then
  echo "Vite not found in node_modules, installing..."
  npm install --no-save vite@4.4.5
fi

# Run the build command
echo "Running Vite build..."
./node_modules/.bin/vite build

echo "Build completed!"
