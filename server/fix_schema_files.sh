#!/bin/bash

echo "Converting Schema files from ES modules to CommonJS..."

# Create a directory for backups if it doesn't exist
mkdir -p schema_backups

# Process each Schema file
for file in ./Schema/*.js; do
  echo "Converting $file"
  
  # Create a backup
  cp "$file" "schema_backups/$(basename "$file").bak"
  
  # Convert import statements to require
  sed -i 's/import mongoose from "mongoose";/const mongoose = require("mongoose");/' "$file"
  
  # Convert export default to module.exports
  sed -i 's/export default/module.exports =/' "$file"
  
  echo "Converted $(basename "$file")"
done

echo "All Schema files have been converted to CommonJS format."
echo "Backups are stored in the schema_backups directory."
