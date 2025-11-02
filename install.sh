#!/bin/bash

# Energy Monitoring App - Installation Script
# This script will install all dependencies for the project

echo "🚀 Installing Energy Monitoring App Dependencies..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  Warning: MongoDB is not found. Please install MongoDB."
fi

echo "✅ Prerequisites check passed"
echo ""

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install Frontend Dependencies
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

# Install ML Dependencies
echo "📦 Installing ML Service Dependencies..."
cd ml
pip3 install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ ML service dependencies installed successfully"
else
    echo "❌ Failed to install ML dependencies"
    exit 1
fi
cd ..
echo ""

echo "🎉 All dependencies installed successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Make sure MongoDB is running: mongod"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: cd frontend && npm start"
echo "4. Start the ML service: cd ml && python3 app.py"
echo ""
echo "📖 For more details, see README.md or QUICKSTART.md"
