#!/bin/bash

# ONVENT Frontend Development Setup Script

echo "🚀 Setting up ONVENT frontend development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js is installed (version: $(node --version))"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm is installed (version: $(npm --version))"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Start development server
echo "🚀 Starting development server..."
echo "🌍 Open your browser to http://localhost:5174"
npm run dev