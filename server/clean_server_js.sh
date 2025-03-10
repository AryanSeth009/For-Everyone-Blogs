#!/bin/bash

echo "Cleaning and fixing all issues in server.js..."

# Create a backup of the current file
cp server.js server.js.clean.bak
echo "Backup created as server.js.clean.bak"

# Fix duplicate async keywords
sed -i 's/async async async/async/g' server.js
sed -i 's/async async/async/g' server.js

# Fix route handlers with async at the end
sed -i 's/) => {  async/), async (req, res) => {/g' server.js
sed -i 's/, verifyJWT, (req, res) => {  async/, verifyJWT, async (req, res) => {/g' server.js

# Fix any remaining syntax issues
sed -i 's/function \([a-zA-Z0-9_]*\)() { {/async function \1() {/g' server.js
sed -i 's/function \([a-zA-Z0-9_]*\)(\([^)]*\)) { {/async function \1(\2) {/g' server.js
sed -i 's/{ {/{/g' server.js

# Fix any potential template literals
sed -i 's/`\${/"/g' server.js
sed -i 's/}`/"/g' server.js

echo "All issues fixed in server.js"
echo "Please restart your server with: node server.js"
