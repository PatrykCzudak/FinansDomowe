#!/bin/bash

echo "🛑 Stopping Personal Budget Management Application"
echo "================================================="

# Stop containers
echo "📦 Stopping containers..."
docker-compose down

echo ""
echo "✅ Application stopped successfully!"
echo ""
echo "💡 To remove all data (CAUTION!):"
echo "   docker-compose down -v"
echo ""
echo "🚀 To start again:"
echo "   ./start.sh"