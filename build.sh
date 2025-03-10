#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm run install:all

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Build server
echo "Building server..."
cd server
npm install
cd ..

echo "Build completed successfully!"
