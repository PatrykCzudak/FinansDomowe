#!/bin/bash

# Personal Budget Management - Start Script
# Uruchamia kompletną aplikację z Docker Compose

set -e

echo "🚀 Uruchamianie Personal Budget Management Application..."

# Sprawdź czy Docker jest zainstalowany
if ! command -v docker &> /dev/null; then
    echo "❌ Docker nie jest zainstalowany. Zainstaluj Docker aby kontynuować."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose nie jest zainstalowany. Zainstaluj Docker Compose aby kontynuować."
    exit 1
fi

# Sprawdź czy .env istnieje, jeśli nie - utwórz z domyślnymi wartościami
if [ ! -f .env ]; then
    echo "📝 Tworzenie pliku .env z domyślnymi wartościami..."
    cat > .env << EOF
# Database Configuration
POSTGRES_DB=budget_db
POSTGRES_USER=budget_user
POSTGRES_PASSWORD=budget_pass
DATABASE_URL=postgresql://budget_user:budget_pass@db:5432/budget_db

# Backend Configuration
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Environment
NODE_ENV=production
EOF
fi

# Zatrzymaj poprzednie kontenery jeśli działają
echo "🛑 Zatrzymywanie poprzednich kontenerów..."
docker-compose down --remove-orphans

# Zbuduj obrazy
echo "🔨 Budowanie obrazów Docker..."
docker-compose build --no-cache

# Uruchom aplikację
echo "🌟 Uruchamianie aplikacji..."
docker-compose up -d

# Sprawdź status kontenerów
echo "📊 Sprawdzanie statusu kontenerów..."
sleep 10

# Funkcja sprawdzająca health check
check_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    echo "🔍 Sprawdzanie $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps $service | grep -q "healthy\|Up"; then
            echo "✅ $service jest gotowy!"
            return 0
        fi
        
        echo "⏳ Czekanie na $service (próba $attempt/$max_attempts)..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service nie uruchomił się poprawnie!"
    return 1
}

# Sprawdź każdy serwis
check_health "db"
check_health "backend" 
check_health "frontend"

# Wyświetl status
echo ""
echo "🎉 Aplikacja została uruchomiona pomyślnie!"
echo ""
echo "📍 Dostępne endpointy:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000" 
echo "   API Docs:  http://localhost:8000/docs"
echo "   Database:  localhost:5432"
echo ""
echo "📊 Status kontenerów:"
docker-compose ps

echo ""
echo "📝 Przydatne komendy:"
echo "   Logi aplikacji:     docker-compose logs -f"
echo "   Zatrzymaj:          ./stop.sh"
echo "   Restart:            docker-compose restart"
echo "   Status:             docker-compose ps"
echo ""
echo "✨ Aplikacja gotowa do użycia!"