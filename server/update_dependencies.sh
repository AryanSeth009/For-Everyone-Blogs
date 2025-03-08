#!/bin/bash

# Remove bcrypt and install bcryptjs
npm uninstall bcrypt
npm install bcryptjs@3.0.2

# Add type:module to package.json
# Check if jq is installed, if not install it
if ! command -v jq &> /dev/null; then
    echo "Installing jq..."
    sudo apt-get update
    sudo apt-get install -y jq
fi

# Add type:module to package.json
echo "Adding type:module to package.json..."
jq '. + {"type": "module"}' package.json > package.json.new
mv package.json.new package.json

# Restart the server using PM2
pm2 restart server
