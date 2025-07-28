#!/bin/bash

echo "🚀 Starting Personal Budget Management Backend..."
echo "📊 Database: PostgreSQL"
echo "🖥️  Backend: Python FastAPI"
echo "🌐 Server will run on: http://localhost:5000"
echo "📚 API Documentation: http://localhost:5000/docs"
echo ""

cd backend
echo "📋 Installing Python dependencies..."
python -m pip install -r requirements.txt > /dev/null 2>&1

echo "🔌 Starting FastAPI server..."
python -m uvicorn main:app --host 0.0.0.0 --port 5000 --reload