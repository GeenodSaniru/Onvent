#!/bin/bash

# ONVENT Backend Development Setup Script

echo "🚀 Setting up ONVENT backend development environment..."

# Check if Java is installed
if ! command -v java &> /dev/null
then
    echo "❌ Java is not installed. Please install Java 21+ and try again."
    exit 1
fi

echo "✅ Java is installed (version: $(java --version | head -n 1))"

# Use Maven wrapper instead of checking for Maven installation
echo "✅ Using Maven wrapper (no separate Maven installation required)"

# Start development server using Maven wrapper
echo "🚀 Starting backend development server..."
echo "🌍 Backend will be available at http://localhost:8087"
./mvnw spring-boot:run