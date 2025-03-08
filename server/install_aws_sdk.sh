#!/bin/bash

# Install aws-sdk
echo "Installing aws-sdk..."
npm install aws-sdk@2.1432.0

# Restart the server using PM2
pm2 restart server
