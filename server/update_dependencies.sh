#!/bin/bash

# Remove bcrypt and install bcryptjs
npm uninstall bcrypt
npm install bcryptjs@3.0.2

# Restart the server using PM2
pm2 restart server
