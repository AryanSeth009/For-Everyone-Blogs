#!/bin/bash

# This script updates the AWS SDK configuration for ES modules compatibility

# Set execution permissions for the fix script
chmod +x fix_aws_sdk.sh

# Run the fix script
./fix_aws_sdk.sh

# Check if the fix was successful
if [ $? -eq 0 ]; then
  echo "AWS SDK update completed successfully!"
  echo "The server has been restarted with PM2."
  echo "You can check the logs with: pm2 logs server"
else
  echo "Error: AWS SDK update failed."
  echo "Please check the error messages above."
fi
