#!/bin/bash

# Personal Budget Management - Stop Script
# Zatrzymuje aplikację i czyści zasoby Docker

set -e

echo "🛑 Zatrzymywanie Personal Budget Management Application..."

# Sprawdź czy Docker Compose jest dostępny
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose nie jest zainstalowany."
    exit 1
fi

# Zatrzymaj i usuń kontenery
echo "📦 Zatrzymywanie kontenerów..."
docker-compose down

# Opcjonalnie usuń volumes (odkomentuj jeśli chcesz usunąć dane)
# echo "🗑️  Usuwanie volumes..."
# docker-compose down -v

# Wyświetl status
echo "📊 Status kontenerów po zatrzymaniu:"
docker-compose ps

echo ""
echo "✅ Aplikacja została zatrzymana pomyślnie!"
echo ""
echo "📝 Przydatne komendy:"
echo "   Uruchom ponownie:   ./start.sh"
echo "   Usuń volumes:       docker-compose down -v"
echo "   Usuń obrazy:        docker-compose down --rmi all"
echo "   Wyczyść wszystko:   docker system prune -a"