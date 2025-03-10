#!/bin/bash

echo "Applying comprehensive fixes to server.js..."

# Create a backup of the original file if it doesn't exist
if [ ! -f server.js.original ]; then
    cp server.js server.js.original
    echo "Original backup created as server.js.original"
fi

# Create a new backup for this run
cp server.js server.js.final.bak
echo "Backup created as server.js.final.bak"

# Step 1: Fix AWS SDK related code
echo "Step 1: Disabling AWS SDK..."
sed -i 's/const AWS = require(.aws-sdk.)/\/\/ const AWS = require("aws-sdk")/' server.js
sed -i 's/const s3 = new AWS.S3/\/\/ const s3 = new AWS.S3/' server.js

# Step 2: Fix function declarations to be async
echo "Step 2: Fixing async function declarations..."
sed -i 's/function \([a-zA-Z0-9_]*\)() { {/async function \1() {/g' server.js
sed -i 's/function \([a-zA-Z0-9_]*\)(\([^)]*\)) { {/async function \1(\2) {/g' server.js

# Fix specific functions that need to be async
sed -i 's/function fixAllBlogsAuthors()/async function fixAllBlogsAuthors()/g' server.js
sed -i 's/function fixUsersWithNullEmails()/async function fixUsersWithNullEmails()/g' server.js
sed -i 's/function generateUploadURL()/async function generateUploadURL()/g' server.js
sed -i 's/function generateUsername(email)/async function generateUsername(email)/g' server.js
sed -i 's/function deleteComments(_id)/async function deleteComments(_id)/g' server.js

# Fix any remaining double braces from previous edits
sed -i 's/{ {/{/g' server.js

# Step 3: Fix route handlers to be async
echo "Step 3: Making route handlers async..."
sed -i 's/\(server\.get("[^"]*", \)\([^{]*{[ ]*\)/\1\2 async /g' server.js
sed -i 's/\(server\.post("[^"]*", \)\([^{]*{[ ]*\)/\1\2 async /g' server.js
sed -i 's/\(server\.put("[^"]*", \)\([^{]*{[ ]*\)/\1\2 async /g' server.js
sed -i 's/\(server\.delete("[^"]*", \)\([^{]*{[ ]*\)/\1\2 async /g' server.js

# Step 4: Fix generateUploadURL function
echo "Step 4: Fixing generateUploadURL function..."
cat > temp_function.js << 'EOL'
async function generateUploadURL() {
  // Since S3 is not available, return a placeholder URL
  console.log("S3 upload functionality is disabled");
  const date = new Date();
  const imageName = nanoid() + "-" + date.getTime() + ".jpeg";
  
  // Return a placeholder URL
  return "/placeholder-upload-url/" + imageName;
}
EOL

# Replace the generateUploadURL function in server.js
sed -i '/function generateUploadURL/,/};/c\\n// Placeholder function for S3 uploads\n'"$(cat temp_function.js)" server.js
rm temp_function.js

# Step 5: Fix exports
echo "Step 5: Fixing exports..."
sed -i 's/export { generateUploadURL };/module.exports = { generateUploadURL, server };/' server.js
sed -i 's/export default/module.exports =/' server.js

# Step 6: Add AWS SDK maintenance mode suppression to .env
echo "Step 6: Adding AWS SDK maintenance mode suppression..."
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" .env; then
    echo "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1" >> .env
    echo "Added AWS SDK maintenance mode suppression to .env"
fi

# Step 7: Update PM2 config
echo "Step 7: Updating PM2 ecosystem config..."
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" ecosystem.config.js; then
    sed -i '/interpreter/a\\        env: {\n          AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE: "1"\n        },' ecosystem.config.js
    echo "Updated PM2 ecosystem config"
fi

# Step 8: Fix Schema files
echo "Step 8: Converting Schema files to CommonJS..."
mkdir -p schema_backups

for file in ./Schema/*.js; do
  if [ -f "$file" ]; then
    echo "Converting $file"
    
    # Create a backup
    cp "$file" "schema_backups/$(basename "$file").bak"
    
    # Convert import statements to require
    sed -i 's/import mongoose from "mongoose";/const mongoose = require("mongoose");/' "$file"
    
    # Convert export default to module.exports
    sed -i 's/export default/module.exports =/' "$file"
    
    echo "Converted $(basename "$file")"
  fi
done

echo "All fixes have been applied!"
echo "You can now start your server with: node server.js"
echo "If there are any issues, you can restore from server.js.final.bak or server.js.original"
