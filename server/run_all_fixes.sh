#!/bin/bash

echo "Running comprehensive fixes for server.js and related files..."

# 1. Fix Schema files first
echo "Step 1: Converting Schema files to CommonJS..."
chmod +x fix_schema_files.sh
./fix_schema_files.sh

# 2. Disable AWS SDK and fix CommonJS compatibility issues in server.js
echo "Step 2: Disabling AWS SDK and fixing server.js..."
chmod +x disable_aws_sdk.sh
./disable_aws_sdk.sh

# 3. Add final message
echo ""
echo "All fixes have been applied!"
echo "If the server is still having issues, please check the logs with: pm2 logs server"
echo "You can restore from backups if needed."
