#!/bin/bash

# Script to fix nanoid package compatibility issues

echo "Fixing nanoid package compatibility..."

# Uninstall nanoid v4 (ESM-only)
npm uninstall nanoid

# Install nanoid v3 (CommonJS compatible)
npm install nanoid@3.3.4

echo "nanoid package fixed. Please restart your server."
