#!/usr/bin/env bash
# Argust Trust frontend — quick setup
# Usage: chmod +x setup.sh && ./setup.sh
set -e

echo "Installing dependencies..."
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example (VITE_API_BASE_URL=http://localhost:3000)"
fi

echo "Starting dev server on http://localhost:5173 ..."
npm run dev
