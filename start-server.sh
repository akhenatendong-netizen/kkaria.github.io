#!/bin/bash
# Simple HTTP server to run the project
# This solves CORS issues when opening files directly

echo "Starting local server..."
echo "Open http://localhost:8000 in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python 3 first, then Python 2, then use Node.js http-server
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    npx http-server -p 8000
else
    echo "Error: No HTTP server found. Please install Python or Node.js"
    exit 1
fi

