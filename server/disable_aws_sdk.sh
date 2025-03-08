#!/bin/bash

echo "Disabling AWS SDK functionality to prevent errors..."

# Create a backup of the original server.js
cp server.js server.js.backup

# Use sed to comment out the AWS SDK related code
sed -i '/import aws from/s/^/\/\/ /' server.js
sed -i '/const s3 = new aws.S3/,/});/s/^/\/\/ /' server.js

# Replace the generateUploadURL function with a placeholder
sed -i '/const generateUploadURL = async () => {/,/};/c\
const generateUploadURL = async () => {\
  // Since S3 is not available, return a placeholder URL\
  console.log("S3 upload functionality is disabled");\
  const date = new Date();\
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;\
  \
  // Return a placeholder URL\
  return `/placeholder-upload-url/${imageName}`;\
};' server.js

echo "AWS SDK functionality has been disabled. Restarting server..."
pm2 restart server
