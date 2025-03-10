#!/bin/sh
# Simple build script for Vercel
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Listing node_modules/.bin:"
ls -la node_modules/.bin

# Try to find vite in node_modules
VITE_PATH="./node_modules/.bin/vite"
if [ -f "$VITE_PATH" ]; then
  echo "Found vite at $VITE_PATH"
  $VITE_PATH build
else
  echo "Vite not found at $VITE_PATH"
  echo "Installing vite..."
  npm install vite --no-save
  echo "Running build with npx..."
  npx --no vite build
fi
