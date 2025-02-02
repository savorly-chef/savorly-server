#!/bin/bash

# Clean up previous build
rm -rf dist
rm -rf node_modules

# Install dependencies
pnpm install

# Build the application
pnpm build

# Check if dist/main.js exists
if [ -f "dist/main.js" ]; then
    echo "✅ Build successful! dist/main.js exists"
    # Try to run the application
    NODE_ENV=production PORT=8080 node dist/main.js
else
    echo "❌ Build failed! dist/main.js not found"
    exit 1
fi 