# 🚀 Quick Start - Personal Budget Management (Python + React)

## Szybkie Uruchomienie

### 1. Sprawdź Wymagania
```bash
# Sprawdź czy Docker jest zainstalowany
docker --version
docker-compose --version
```

### 2. Uruchom Aplikację
```bash
cd aplikacja_python
./start.sh
```

### 3. Otwórz Aplikację
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### 4. Zatrzymaj Aplikację
```bash
./stop.sh
```

## Rozwiązywanie Problemów

### Problem: Porty zajęte
```bash
# Sprawdź które porty są używane
netstat -tulpn | grep -E ':(3000|8000|5432)'

# Zatrzymaj konflikty lub zmień porty w docker-compose.yml
```

### Problem: Docker nie działa
```bash
# Ubuntu/Debian
sudo systemctl start docker

# macOS
# Uruchom Docker Desktop

# Windows
# Uruchom Docker Desktop
```

### Problem: Aplikacja nie startuje
```bash
# Sprawdź logi
docker-compose logs -f

# Restart z czyszczeniem
./stop.sh
docker system prune -f
./start.sh
```

### Problem: Baza danych
```bash
# Reset bazy danych
./stop.sh
# Wybierz opcję usunięcia woluminów (y)
./start.sh
```

## Przykładowe Dane

Po pierwszym uruchomieniu aplikacja zawiera:
- 3 kategorie wydatków (Żywność, Transport, Rozrywka)
- 1 źródło dochodu (Pensja)
- 1 inwestycję (AAPL)
- 1 cel oszczędnościowy (Wakacje)

## Komendy Pomocnicze

```bash
# Status kontenerów
docker-compose ps

# Logi w czasie rzeczywistym
docker-compose logs -f

# Restart pojedynczej usługi
docker-compose restart backend

# Aktualizacja aplikacji
git pull
docker-compose build
docker-compose up -d
```