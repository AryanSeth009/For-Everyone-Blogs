#!/bin/bash

# Script to fix CommonJS syntax issues in server.js

echo "Fixing CommonJS syntax issues in server.js..."

# Create a backup of the current file if it doesn't exist
if [ ! -f server.js.bak ]; then
    cp server.js server.js.bak
    echo "Backup created as server.js.bak"
fi

# Fix the arrow function syntax for generateUploadURL
sed -i 's/const generateUploadURL = async () => {/async function generateUploadURL() {/' server.js

# Fix other arrow functions in the file
sed -i 's/const formatDatatoSend = (user) => {/function formatDatatoSend(user) {/' server.js
sed -i 's/const generateUsername = (email) => {/function generateUsername(email) {/' server.js
sed -i 's/const verifyJWT = (req, res, next) => {/function verifyJWT(req, res, next) {/' server.js
sed -i 's/const deleteComments = async (_id) => {/async function deleteComments(_id) {/' server.js

# Fix any remaining arrow functions in callbacks (this is a more general approach)
sed -i 's/\(([^)]*)\) =>/function\1/g' server.js

# Fix module.exports at the end of the file
sed -i 's/export { generateUploadURL };/module.exports = { generateUploadURL, server };/' server.js

echo "CommonJS syntax fixes applied to server.js"
echo "Please restart your server with: pm2 restart server"
