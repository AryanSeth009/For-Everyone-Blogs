#!/bin/sh
# Simple build script for Vercel
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Running Vite build..."
npx --no vite build
