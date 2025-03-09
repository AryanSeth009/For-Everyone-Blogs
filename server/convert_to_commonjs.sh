#!/bin/bash

# Script to convert server.js from ES modules to CommonJS

echo "Converting server.js from ES modules to CommonJS..."

# Create a backup of the original file
cp server.js server.js.bak
echo "Backup created as server.js.bak"

# Convert import statements to require statements
sed -i 's/import express from "express";/const express = require("express");/' server.js
sed -i 's/import mongoose from "mongoose";/const mongoose = require("mongoose");/' server.js
sed -i 's/import "dotenv\/config";/require("dotenv").config();/' server.js
sed -i 's/import bcrypt from "bcryptjs";/const bcrypt = require("bcryptjs");/' server.js
sed -i 's/import { nanoid } from "nanoid";/const { nanoid } = require("nanoid");/' server.js
sed -i 's/import jwt from "jsonwebtoken";/const jwt = require("jsonwebtoken");/' server.js
sed -i 's/import cors from "cors";/const cors = require("cors");/' server.js
sed -i 's/import admin from "firebase-admin";/const admin = require("firebase-admin");/' server.js
sed -i 's/import { getAuth } from "firebase-admin\/auth";/const { getAuth } = require("firebase-admin\/auth");/' server.js
sed -i 's/import { fileURLToPath } from "url";/const { fileURLToPath } = require("url");/' server.js
sed -i 's/import path from "path";/const path = require("path");/' server.js
sed -i 's/import dotenv from .dotenv.;/const dotenv = require("dotenv");/' server.js

# Fix User, Blog, Notification, Comment imports
sed -i 's/import User from ".\/Schema\/User.js";/const User = require(".\/Schema\/User");/' server.js
sed -i 's/import Blog from ".\/Schema\/Blog.js";/const Blog = require(".\/Schema\/Blog");/' server.js
sed -i 's/import Notification from ".\/Schema\/Notification.js";/const Notification = require(".\/Schema\/Notification");/' server.js
sed -i 's/import Comment from ".\/Schema\/Comment.js";/const Comment = require(".\/Schema\/Comment");/' server.js

# Fix __dirname definition
sed -i '/const __dirname = path.dirname(fileURLToPath(import.meta.url));/d' server.js

# Fix AWS SDK import
sed -i 's/import { createRequire } from .module.;//' server.js
sed -i 's/const require = createRequire(import.meta.url);//' server.js
sed -i 's/\/\/ const AWS = require/const AWS = require/' server.js
sed -i 's/\/\/ const s3 = new AWS.S3/const s3 = new AWS.S3/' server.js

# Change export statements to module.exports
sed -i 's/export { generateUploadURL };/module.exports = { generateUploadURL, server };/' server.js

echo "Converting Schema files from ES modules to CommonJS..."

# Convert Schema files
for file in ./Schema/*.js; do
  echo "Converting $file"
  # Create a backup
  cp "$file" "$file.bak"
  
  # Convert import to require
  sed -i 's/import mongoose from "mongoose";/const mongoose = require("mongoose");/' "$file"
  
  # Convert export default to module.exports
  sed -i 's/export default/module.exports =/' "$file"
done

echo "Conversion completed. Please restart your server."
echo "If there are any issues, you can restore the backup files (.bak)."
