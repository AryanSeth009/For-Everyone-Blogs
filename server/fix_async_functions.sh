#!/bin/bash

echo "Fixing async/await syntax in server.js..."

# Create a backup of the current file
cp server.js server.js.async.bak
echo "Backup created as server.js.async.bak"

# Fix function declarations with async
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

# Fix any callback functions that use await
sed -i 's/\(app\.get([^{]*{\)/\1 async /g' server.js
sed -i 's/\(app\.post([^{]*{\)/\1 async /g' server.js
sed -i 's/\(app\.put([^{]*{\)/\1 async /g' server.js
sed -i 's/\(app\.delete([^{]*{\)/\1 async /g' server.js
sed -i 's/\(server\.get([^{]*{\)/\1 async /g' server.js
sed -i 's/\(server\.post([^{]*{\)/\1 async /g' server.js
sed -i 's/\(server\.put([^{]*{\)/\1 async /g' server.js
sed -i 's/\(server\.delete([^{]*{\)/\1 async /g' server.js

# Fix route handlers to be async
sed -i 's/\(server\.[a-z]\+("[^"]*", [^{]*{[ ]*\)/\1 async /g' server.js
sed -i 's/\(server\.[a-z]\+("[^"]*", verifyJWT, [^{]*{[ ]*\)/\1 async /g' server.js

echo "Async/await syntax fixes applied to server.js"
echo "Please restart your server with: node server.js"
