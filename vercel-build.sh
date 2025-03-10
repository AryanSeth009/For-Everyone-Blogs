#!/bin/bash

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm run install:all

# Build frontend
echo "Building frontend..."
cd frontend
node build.js
cd ..

echo "Build completed successfully!"
