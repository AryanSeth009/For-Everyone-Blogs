#!/bin/bash

# Make sure aws-sdk is installed
echo "Checking if aws-sdk is installed..."
if ! npm list aws-sdk | grep -q aws-sdk; then
    echo "Installing aws-sdk..."
    npm install aws-sdk@2.1432.0
fi

# Fix aws-sdk import in server.js
echo "Fixing aws-sdk import in server.js..."
sed -i 's/import aws from .aws-sdk.;/import { createRequire } from \x27module\x27;\nconst require = createRequire(import.meta.url);\nconst AWS = require(\x27aws-sdk\x27);/' server.js
sed -i 's/const s3 = new aws.S3/const s3 = new AWS.S3/' server.js

# Add AWS SDK maintenance mode suppression to .env if not already there
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" .env; then
    echo "Adding AWS SDK maintenance mode suppression to .env..."
    echo "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1'" >> .env
fi

# Restart the server using PM2
pm2 restart server
