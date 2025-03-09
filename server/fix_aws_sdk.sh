#!/bin/bash

# Make sure aws-sdk is installed
echo "Checking if aws-sdk is installed..."
if ! npm list aws-sdk | grep -q aws-sdk; then
    echo "Installing aws-sdk..."
    npm install aws-sdk@2.1432.0
fi

# Fix aws-sdk import in server.js
echo "Fixing aws-sdk import in server.js..."
# Uncomment the AWS SDK import and configuration code
sed -i 's/\/\/ import { createRequire } from/import { createRequire } from/' server.js
sed -i 's/\/\/ const require = createRequire/const require = createRequire/' server.js
sed -i 's/\/\/ const AWS = require/const AWS = require/' server.js
sed -i 's/\/\/ const s3 = new AWS.S3/const s3 = new AWS.S3/' server.js

# Add AWS SDK maintenance mode suppression to .env file
echo "Adding AWS SDK maintenance mode suppression to .env..."
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" .env; then
    echo "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1" >> .env
fi

# Update ecosystem.config.js to include the environment variable
echo "Updating PM2 ecosystem config to include the suppression variable..."
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" ecosystem.config.js; then
    sed -i '/interpreter/a\\        env: {\n          AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE: "1"\n        },' ecosystem.config.js
fi

echo "Restarting the server with PM2..."
pm2 restart server

echo "AWS SDK fix completed successfully!"
