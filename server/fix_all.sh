#!/bin/bash

# Comprehensive script to fix all issues

echo "Starting comprehensive fix for server..."

# 1. Fix package.json (already done manually)
echo "Package.json has been updated to remove 'type: module'"

# 2. Fix nanoid package
echo "Fixing nanoid package..."
chmod +x fix_nanoid.sh
./fix_nanoid.sh

# 3. Convert code from ES modules to CommonJS
echo "Converting code from ES modules to CommonJS..."
chmod +x convert_to_commonjs.sh
./convert_to_commonjs.sh

# 4. Add AWS SDK maintenance mode suppression to .env file
echo "Adding AWS SDK maintenance mode suppression to .env..."
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" .env; then
    echo "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1" >> .env
fi

# 5. Update ecosystem.config.js to include the environment variable
echo "Updating PM2 ecosystem config..."
if ! grep -q "AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE" ecosystem.config.js; then
    sed -i '/interpreter/a\\        env: {\n          AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE: "1"\n        },' ecosystem.config.js
fi

# 6. Restart the server
echo "Restarting the server with PM2..."
pm2 restart server

echo "All fixes have been applied. Please check the server logs with 'pm2 logs server'."
echo "If there are any issues, you can restore the backup files (.bak)."
