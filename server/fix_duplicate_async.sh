#!/bin/bash

echo "Fixing duplicate async keywords in server.js..."

# Create a backup of the current file
cp server.js server.js.async_fix.bak
echo "Backup created as server.js.async_fix.bak"

# Fix duplicate async keywords
sed -i 's/async async async/async/g' server.js
sed -i 's/async async/async/g' server.js

# Fix route handlers with async at the end
sed -i 's/) => {  async/), async (req, res) => {/g' server.js
sed -i 's/, verifyJWT, (req, res) => {  async/, verifyJWT, async (req, res) => {/g' server.js

echo "Duplicate async keywords fixed in server.js"
echo "Please restart your server with: node server.js"
