#!/bin/bash

echo "🌫️  Iniciando NIEBLA Admin..."
echo ""

# Create necessary directories
mkdir -p data uploads/images uploads/videos

# Initialize database if doesn't exist
if [ ! -f "data/products.json" ]; then
    echo "[]" > data/products.json
    echo "✓ Created products database"
fi

if [ ! -f "data/settings.json" ]; then
    echo '{"featuredProducts":[],"saleProducts":[],"mostPurchased":[],"storeInfo":{"name":"NIEBLA","phone":"50671426489","deliverySameDay":true,"deliveryNextDay":true}}' > data/settings.json
    echo "✓ Created settings database"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build frontend if needed
if [ ! -d "dist" ]; then
    echo "🔨 Building frontend..."
    npm run build
fi

echo ""
echo "🚀 Starting server..."
echo ""
echo "📱 Admin Panel: http://localhost:3001"
echo "🛒 Store: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the server (backend + frontend)
node server.js
