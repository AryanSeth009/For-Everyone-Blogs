#!/bin/bash

echo "Disabling AWS SDK functionality and fixing CommonJS compatibility issues..."

# Create a backup of the original server.js if it doesn't exist
if [ ! -f server.js.original ]; then
    cp server.js server.js.original
    echo "Original backup created as server.js.original"
fi

# Create a new backup for this run
cp server.js server.js.backup
echo "Backup created as server.js.backup"

# Comment out all AWS SDK related imports and configurations
sed -i '/aws-sdk/s/^/\/\/ /' server.js
sed -i '/AWS/s/^/\/\/ /' server.js
sed -i '/s3 =/s/^/\/\/ /' server.js

# Fix the generateUploadURL function to not use AWS
cat > temp_function.js << 'EOL'
function generateUploadURL() {
  // Since S3 is not available, return a placeholder URL
  console.log("S3 upload functionality is disabled");
  const date = new Date();
  const imageName = nanoid() + "-" + date.getTime() + ".jpeg";
  
  // Return a placeholder URL
  return "/placeholder-upload-url/" + imageName;
}
EOL

# Replace the generateUploadURL function in server.js
sed -i '/const generateUploadURL/,/};/c\\n// Placeholder function for S3 uploads\n'"$(cat temp_function.js)" server.js
rm temp_function.js

# Fix arrow functions to use traditional function syntax
sed -i 's/const \([a-zA-Z0-9_]*\) = \(async \)\?(\([^)]*\)) =>/function \1(\3) {/' server.js
sed -i 's/const \([a-zA-Z0-9_]*\) = \(async \)\?function/function \1/' server.js

# Fix export statements
sed -i 's/export { generateUploadURL };/module.exports = { generateUploadURL, server };/' server.js
sed -i 's/export default/module.exports =/' server.js

# Add AWS SDK maintenance mode suppression to .env
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" .env; then
    echo "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1" >> .env
    echo "Added AWS SDK maintenance mode suppression to .env"
fi

# Update PM2 config to include the suppression variable
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" ecosystem.config.js; then
    sed -i '/interpreter/a\\        env: {\n          AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE: "1"\n        },' ecosystem.config.js
    echo "Updated PM2 ecosystem config"
fi

echo "All AWS SDK functionality has been disabled and CommonJS compatibility issues fixed."
echo "Restarting server..."
pm2 restart server

echo "Done! Check the server logs with: pm2 logs server"
echo "If there are any issues, you can restore from server.js.backup or server.js.original"
