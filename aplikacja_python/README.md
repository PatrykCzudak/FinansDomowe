# Personal Budget Management Application (Python FastAPI + React)

Zaawansowana aplikacja do zarządzania budżetem osobistym z wykorzystaniem FastAPI (Python) jako backend i React z TypeScript jako frontend. Aplikacja oferuje kompleksowe śledzenie finansów, analizę portfela inwestycyjnego, analizę ryzyka VaR i asystenta AI.

## 🚀 Funkcje

### 💰 Zarządzanie Budżetem
- **Kategorie wydatków** z kolorami i limitami budżetowymi
- **Śledzenie dochodów** z różnymi częstotliwościami
- **Rejestrowanie wydatków** z przypisaniem do kategorii
- **Filtrowanie po miesiącach** - przeglądanie historycznych danych

### 📈 Portfolio Inwestycyjne
- **Zarządzanie inwestycjami** (akcje, ETF, obligacje)
- **Automatyczne aktualizacje cen** z Yahoo Finance co 15 minut
- **Obliczenia zysków/strat** w czasie rzeczywistym
- **Wykresy alokacji aktywów** i wyników portfela
- **Wyszukiwanie instrumentów** finansowych

### 🎯 Cele Oszczędnościowe
- **Tworzenie celów oszczędnościowych** z datami docelowymi
- **Śledzenie postępów** z paskami postępu
- **Kalkulatory miesięcznych oszczędności**
- **Kolorowe kategorie** dla lepszej organizacji

### ⚠️ Analiza Ryzyka
- **Value at Risk (VaR)** na poziomach ufności 95% i 99%
- **Expected Shortfall (ES)** dla analizy ryzyka ogona
- **Metryki ryzyka**: Beta, Sharpe Ratio, Maximum Drawdown
- **Testy stresowe** na podstawie kryzysów historycznych

### 🤖 Asystent AI
- **Analiza portfela** z rekomendacjami dywersyfikacji
- **Analiza budżetu** z wykrywaniem anomalii wydatków
- **Prognozowanie** cen aktywów z modelami ML
- **Optymalizacja portfela** Markowitz i AI-enhanced

## 🛠️ Stack Technologiczny

### Backend (Python FastAPI)
- **FastAPI** - nowoczesny framework webowy
- **SQLAlchemy** - ORM do zarządzania bazą danych
- **PostgreSQL** - relacyjna baza danych
- **yfinance** - dane rynkowe z Yahoo Finance
- **pandas/numpy** - analiza danych finansowych
- **uvicorn** - serwer ASGI
- **APScheduler** - harmonogram zadań

### Frontend (React + TypeScript)
- **React 18** z TypeScript
- **Vite** - narzędzie budowania i dev server
- **Tailwind CSS** - utility-first CSS framework
- **shadcn/ui** - biblioteka komponentów UI
- **TanStack Query** - zarządzanie stanem serwera
- **Recharts** - wykresy i wizualizacje
- **React Hook Form** - obsługa formularzy

### Infrastructure
- **Docker & Docker Compose** - konteneryzacja
- **Nginx** - reverse proxy dla frontendu
- **PostgreSQL** - baza danych w kontenerze

## 🚀 Szybki Start

### Wymagania
- Docker i Docker Compose
- Port 3000 (frontend), 8000 (backend), 5432 (PostgreSQL)

### Uruchomienie Aplikacji

1. **Sklonuj i przejdź do folderu:**
```bash
cd aplikacja_python
```

2. **Uruchom aplikację jedną komendą:**
```bash
./start.sh
```

Skrypt automatycznie:
- Sprawdza czy Docker jest uruchomiony
- Tworzy plik `.env` z domyślną konfiguracją
- Buduje wszystkie kontenery
- Uruchamia usługi w kolejności (PostgreSQL → Backend → Frontend)
- Sprawdza stan każdej usługi
- Otwiera aplikację w przeglądarce

### Dostęp do Aplikacji

Po uruchomieniu aplikacja będzie dostępna pod:

- **Frontend (React):** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **PostgreSQL:** localhost:5432

### Zatrzymanie Aplikacji

```bash
./stop.sh
```

Skrypt oferuje opcje:
- Zatrzymanie kontenerów
- Usunięcie woluminów (dane)
- Usunięcie obrazów Docker

## 📊 Wykorzystanie

### 1. Zarządzanie Kategoriami i Dochodami
- Przejdź do zakładki "Admin/Budżet"
- Dodaj kategorie wydatków z budżetami
- Zarejestruj źródła dochodów

### 2. Śledzenie Wydatków
- Zakładka "Wydatki" - dodawaj codzienne wydatki
- Używaj selektora miesiąca w nagłówku do filtrowania
- Wyszukuj wydatki po opisie lub kwocie

### 3. Portfolio Inwestycyjne
- Zakładka "Inwestycje" → "Portfolio"
- Dodaj swoje inwestycje (akcje, ETF)
- Ceny aktualizują się automatycznie co 15 minut

### 4. Cele Oszczędnościowe
- Zakładka "Cele Oszczędnościowe"
- Ustaw cele z datami docelowymi
- Dodawaj kwoty oszczędności

### 5. Analiza Ryzyka
- Zakładka "Inwestycje" → "Ryzyko"
- Przegląd VaR, Expected Shortfall
- Testy stresowe dla różnych scenariuszy

### 6. Asystent AI
- Zakładka "Inwestycje" → "AI Asystent"
- Automatyczne analizy portfela i budżetu
- Zadawaj pytania o finanse

## 🗃️ Baza Danych

Aplikacja automatycznie:
- Tworzy bazę danych PostgreSQL jeśli nie istnieje
- Inicjalizuje tabele przy pierwszym uruchomieniu
- Dodaje przykładowe dane demonstracyjne
- Zachowuje dane między restartami (Docker volumes)

### Struktura Danych
- **categories** - kategorie wydatków
- **incomes** - źródła dochodów
- **expenses** - rejestr wydatków
- **investments** - portfolio inwestycyjne
- **savings_goals** - cele oszczędnościowe

## 🔧 Rozwój

### Struktura Projektu
```
aplikacja_python/
├── backend/          # Python FastAPI backend
│   ├── main.py       # Główny plik aplikacji
│   ├── models.py     # Modele SQLAlchemy
│   ├── schemas.py    # Schematy Pydantic
│   ├── database.py   # Konfiguracja bazy danych
│   ├── price_service.py  # Serwis cen Yahoo Finance
│   ├── ai_service.py     # Serwis asystenta AI
│   └── requirements.txt  # Zależności Python
├── frontend/         # React TypeScript frontend
│   ├── src/          # Kod źródłowy
│   ├── package.json  # Zależności Node.js
│   └── nginx.conf    # Konfiguracja Nginx
├── docker-compose.yml    # Orkiestracja kontenerów
├── init-db.sql          # Inicjalizacja bazy danych
├── start.sh             # Skrypt uruchamiający
└── stop.sh              # Skrypt zatrzymujący
```

### Logowanie i Debugowanie

**Sprawdzenie logów wszystkich usług:**
```bash
docker-compose logs -f
```

**Logi konkretnej usługi:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Status kontenerów:**
```bash
docker-compose ps
```

## 🔒 Konfiguracja

### Zmienne Środowiskowe (.env)
```bash
DATABASE_URL=postgresql://budget_user:budget_password@localhost:5432/budget_db
PYTHONPATH=/app
POSTGRES_DB=budget_db
POSTGRES_USER=budget_user
POSTGRES_PASSWORD=budget_password
```

### Konfiguracja Portów
Można zmienić porty w `docker-compose.yml`:
- Frontend: port 3000
- Backend: port 8000
- PostgreSQL: port 5432

## 📝 API Endpoints

### Categories
- `GET /api/categories` - Lista kategorii
- `POST /api/categories` - Dodaj kategorię
- `PUT /api/categories/{id}` - Aktualizuj kategorię
- `DELETE /api/categories/{id}` - Usuń kategorię

### Investments  
- `GET /api/investments` - Lista inwestycji
- `POST /api/investments` - Dodaj inwestycję
- `PUT /api/investments/{id}` - Aktualizuj inwestycję

### Price Service
- `POST /api/prices/update` - Aktualizuj ceny
- `GET /api/prices/search?q={symbol}` - Wyszukaj symbol
- `GET /api/prices/stock/{symbol}` - Info o akcji

### AI Assistant
- `GET /api/ai/portfolio-analysis` - Analiza portfela
- `GET /api/ai/budget-analysis` - Analiza budżetu
- `POST /api/ai/custom-query` - Zapytanie AI

Pełna dokumentacja API: http://localhost:8000/docs

## 🤝 Wsparcie

Jeśli napotkasz problemy:

1. **Sprawdź logi:** `docker-compose logs -f`
2. **Restart usług:** `./stop.sh` następnie `./start.sh`
3. **Sprawdź porty:** Upewnij się że porty 3000, 8000, 5432 są wolne
4. **Wyczyść dane:** `./stop.sh` → usuń woluminy → `./start.sh`

---

**Aplikacja Personal Budget Management** - Kompleksowe narzędzie do zarządzania finansami osobistymi z zaawansowaną analizą inwestycji i asystentem AI. 🚀