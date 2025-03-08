#!/bin/bash

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
