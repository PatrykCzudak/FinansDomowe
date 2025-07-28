# Personal Budget Management Application

## Opis

Kompleksowa aplikacja do zarządzania budżetem osobistym z backendem Python FastAPI i frontendem React. Aplikacja oferuje śledzenie wydatków, zarządzanie inwestycjami, analizę ryzyka oraz cele oszczędnościowe.

## Funkcje

### 🏠 Dashboard
- Przegląd miesięcznych przychodów i wydatków
- Wartość portfolio inwestycyjnego
- Najnowsze transakcje
- Top inwestycje z zyskami/stratami

### 💰 Zarządzanie wydatkami
- Dodawanie i kategoryzowanie wydatków
- Kolorowe kategorie budżetowe
- Filtrowanie po datach i kategoriach
- Historia wszystkich transakcji

### 📈 Portfolio inwestycyjne
- Śledzenie akcji, ETF, obligacji, kryptowalut
- Automatyczne aktualizacje cen z Yahoo Finance
- Kalkulacja zysków/strat w czasie rzeczywistym
- Alokacja portfolio według typów instrumentów

### 🎯 Cele oszczędnościowe
- Tworzenie spersonalizowanych celów finansowych
- Śledzenie postępu z paskami wizualnymi
- Kategorie celów (podróże, dom, edukacja, etc.)
- Kalkulacja czasu do osiągnięcia celu

### 📊 Podsumowanie i analizy
- Wykresy budżet vs wydatki
- Alokacja inwestycji (wykres kołowy)
- Szczegóły wydatków według kategorii
- Przegląd miesięczny wszystkich finansów

### ⚠️ Analiza ryzyka
- Kalkulacja Value at Risk (VaR) 95% i 99%
- Expected Shortfall (ES) dla scenariuszy skrajnych
- Metryki ryzyka: Volatility, Sharpe Ratio, Max Drawdown, Beta
- Konfigurowalne poziomy ufności i horyzonty czasowe

## Architektura techniczna

### Backend (Python FastAPI)
- **Framework**: FastAPI z SQLAlchemy ORM
- **Baza danych**: PostgreSQL z automatyczną inicjalizacją
- **API finansowe**: Yahoo Finance dla cen w czasie rzeczywistym
- **Analiza ryzyka**: NumPy/Pandas dla obliczeń finansowych
- **Testy zdrowia**: Health checks dla wszystkich serwisów

### Frontend (React + TypeScript)
- **Framework**: React 18 z TypeScript
- **Styling**: Tailwind CSS + shadcn/ui komponenty
- **Zarządzanie stanem**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Wykresy**: Recharts dla wizualizacji danych

### DevOps
- **Konteneryzacja**: Docker + Docker Compose
- **Proxy**: Nginx dla produkcji
- **Baza danych**: PostgreSQL 15 z trwałymi volumes
- **Skrypty**: Automatyczne start.sh/stop.sh

## Szybki start

### Wymagania
- Docker & Docker Compose
- 4GB RAM (minimum)
- Porty 3000, 8000, 5432 dostępne

### Instalacja

1. **Sklonuj repozytorium:**
```bash
git clone <repository-url>
cd personal-budget-app
```

2. **Uruchom aplikację jedną komendą:**
```bash
./start.sh
```

3. **Otwórz aplikację:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Zatrzymanie
```bash
./stop.sh
```

## Konfiguracja środowiska

Aplikacja automatycznie tworzy plik `.env` z domyślnymi wartościami. Możesz je dostosować:

```env
# Database Configuration
POSTGRES_DB=budget_db
POSTGRES_USER=budget_user  
POSTGRES_PASSWORD=budget_pass
DATABASE_URL=postgresql://budget_user:budget_pass@db:5432/budget_db

# Ports
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Environment  
NODE_ENV=production
```

## Endpointy API

### Kategorie
- `GET /api/categories` - Lista kategorii
- `POST /api/categories` - Dodaj kategorię
- `PUT /api/categories/{id}` - Aktualizuj kategorię
- `DELETE /api/categories/{id}` - Usuń kategorię

### Przychody
- `GET /api/incomes` - Lista przychodów
- `POST /api/incomes` - Dodaj przychód

### Wydatki
- `GET /api/expenses` - Lista wydatków (z filtrami)
- `POST /api/expenses` - Dodaj wydatek

### Inwestycje
- `GET /api/investments` - Portfolio
- `POST /api/investments` - Dodaj inwestycję

### Cele oszczędnościowe
- `GET /api/savings-goals` - Lista celów
- `POST /api/savings-goals` - Dodaj cel

### Ceny i analiza ryzyka
- `GET /api/prices/update` - Aktualizuj ceny
- `GET /api/prices/{symbol}` - Cena instrumentu
- `POST /api/risk/var-calculation` - Analiza VaR/ES

## Rozwój lokalny

### Backend development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend development  
```bash
cd frontend
npm install
npm run dev
```

### Database management
```bash
# Restart tylko bazy danych
docker-compose restart db

# Logs bazy danych
docker-compose logs db

# Connect do bazy
docker-compose exec db psql -U budget_user -d budget_db
```

## Monitorowanie

### Logi aplikacji
```bash
# Wszystkie serwisy
docker-compose logs -f

# Konkretny serwis
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Status kontenerów
```bash
docker-compose ps
```

### Health checks
Wszystkie serwisy mają wbudowane health checks:
- Backend: `curl http://localhost:8000/`
- Frontend: `curl http://localhost:3000/`
- Database: `pg_isready`

## Bezpieczeństwo

- Baza danych dostępna tylko lokalnie
- API zabezpieczone CORS
- Nginx proxy z bezpiecznymi nagłówkami
- Brak wrażliwych danych w obrazach Docker

## Rozwiązywanie problemów

### Problem z portami
```bash
# Sprawdź zajęte porty
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
netstat -tulpn | grep :5432

# Zatrzymaj konfliktujące serwisy
sudo systemctl stop postgresql  # jeśli lokalny PostgreSQL
```

### Problem z miejscem na dysku
```bash
# Wyczyść nieużywane obrazy
docker system prune -a

# Usuń volumes (OSTRZEŻENIE: usuwa dane!)
docker-compose down -v
```

### Reset całej aplikacji
```bash
./stop.sh
docker-compose down -v --rmi all
./start.sh
```

## Wsparcie

W przypadku problemów:
1. Sprawdź logi: `docker-compose logs -f`
2. Zrestartuj serwisy: `docker-compose restart`
3. Pełny reset: `./stop.sh && ./start.sh`

## Licencja

MIT License - szczegóły w pliku LICENSE.

---

**Autor**: Personal Budget Management Team  
**Wersja**: 1.0.0  
**Ostatnia aktualizacja**: 2025-01-28