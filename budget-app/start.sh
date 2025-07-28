#!/bin/bash

echo "🚀 Starting Personal Budget Management Application"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker compose is available (new syntax)
if ! docker compose version &> /dev/null; then
    echo "❌ docker compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. You can modify it if needed."
fi

# Pull latest images (if needed)
echo "📦 Pulling Docker images..."
docker compose pull

# Build and start the application
echo "🏗️  Building and starting containers..."
echo "This may take a few minutes on first run..."

docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check database
if docker compose exec -T db pg_isready -U postgres -d budgetdb > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "⚠️  Database is still starting..."
fi

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready"
else
    echo "⚠️  Backend is still starting..."
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "⚠️  Frontend is still starting..."
fi

echo ""
echo "🎉 Application started successfully!"
echo "=================================================="
echo "📊 Access your application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "📋 Useful commands:"
echo "   View logs:     docker compose logs -f"
echo "   Stop app:      docker compose down"
echo "   Restart:       docker compose restart"
echo ""
echo "🔧 Database connection:"
echo "   Host: localhost:5432"
echo "   Database: budgetdb"
echo "   User: postgres"
echo "   Password: password"
echo ""
echo "Press Ctrl+C to stop the application"