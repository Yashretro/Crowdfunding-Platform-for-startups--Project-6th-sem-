#!/usr/bin/env bash
# Simple deploy helper for servers with Node.js and PM2 installed.
# Usage: run this on the server in the project directory.

set -euo pipefail

echo "Pulling latest code..."
git pull origin main || git pull

echo "Installing dependencies..."
npm ci --production

echo "Building frontend..."
if [ -d "./src" ]; then
  npm run build || true
fi

echo "Starting backend with PM2..."
if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 not found. Installing PM2 globally..."
  npm install -g pm2
fi

pm2 startOrRestart ecosystem.config.js --env production
pm2 save

echo "Deploy finished. Check PM2 status with: pm2 status"
