# 💰 Personal Budget Management - Docker Setup

Zaawansowana aplikacja do zarządzania budżetem osobistym z analizą ryzyka inwestycyjnego, zbudowana z Python FastAPI backend i React frontend.

## 🚀 Szybki Start z Docker

### Wymagania
- Docker
- Docker Compose

### Uruchomienie aplikacji

```bash
# Sklonuj repozytorium
git clone <your-repo-url>
cd budget-app

# Uruchom całą aplikację z bazą danych
docker-compose up -d

# Lub uruchom z logami w czasie rzeczywistym
docker-compose up
```

**Aplikacja będzie dostępna pod:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

### Zatrzymanie aplikacji

```bash
# Zatrzymaj kontenery
docker-compose down

# Zatrzymaj i usuń volumes (UWAGA: usuwa dane!)
docker-compose down -v
```

## 📁 Struktura Projektu

```
budget-app/
├── backend/              # Python FastAPI backend
│   ├── main.py          # Główna aplikacja
│   ├── requirements.txt # Zależności Python
│   └── Dockerfile       # Kontener backend
├── frontend/            # React TypeScript frontend
│   ├── src/            # Kod źródłowy React
│   ├── package.json    # Zależności Node.js
│   ├── Dockerfile      # Kontener frontend
│   └── nginx.conf      # Konfiguracja Nginx
├── docker-compose.yml  # Orchestracja kontenerów
├── init-db.sql        # Inicjalizacja bazy danych
└── .env.example       # Przykład zmiennych środowiskowych
```

## 🛠️ Funkcje

### Backend (Python FastAPI)
- **RESTful API**: Kompletne API dla budżetu i inwestycji
- **PostgreSQL**: Trwałe przechowywanie danych
- **Yahoo Finance**: Prawdziwe dane rynkowe
- **Risk Analysis**: VaR, Expected Shortfall, metryki portfolio
- **Auto Health Checks**: Monitorowanie stanu aplikacji

### Frontend (React + TypeScript)
- **Modern UI**: Responsywny interface z Tailwind CSS
- **Real-time Data**: Integracja z backend API
- **Investment Tracking**: Portfolio management z wykresami
- **Budget Management**: Kategorie, wydatki, cele oszczędnościowe
- **Risk Visualization**: Interaktywne wykresy analizy ryzyka

### Infrastruktura Docker
- **Multi-stage builds**: Optymalizowane obrazy produkcyjne
- **Health checks**: Automatyczne monitorowanie zdrowia kontenerów
- **Database initialization**: Automatyczne tworzenie bazy danych
- **Service dependencies**: Właściwa kolejność uruchamiania serwisów
- **Volume persistence**: Trwałe przechowywanie danych PostgreSQL

## 🔧 Konfiguracja

### Zmienne środowiskowe

Skopiuj `.env.example` do `.env` i dostosuj:

```bash
cp .env.example .env
```

### Konfiguracja Development

```bash
# Backend development (bez Docker)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend development (bez Docker)
cd frontend
npm install
npm run dev
```

### Konfiguracja Production

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy z production variables
docker-compose -f docker-compose.yml up -d
```

## 🔍 Debugging

### Logi kontenerów

```bash
# Wszystkie logi
docker-compose logs

# Logi konkretnego serwisu
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Logi w czasie rzeczywistym
docker-compose logs -f backend
```

### Status kontenerów

```bash
# Sprawdź status
docker-compose ps

# Sprawdź health checks
docker ps
```

### Połączenie z bazą danych

```bash
# Podłącz się do PostgreSQL
docker exec -it budget_db psql -U postgres -d budgetdb

# Sprawdź tabele
\dt

# Przykładowe query
SELECT * FROM categories;
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Status aplikacji

### Budget Management
- `GET /api/categories` - Lista kategorii budżetowych
- `POST /api/categories` - Dodaj kategorię
- `GET /api/expenses` - Lista wydatków
- `POST /api/expenses` - Dodaj wydatek

### Investment Portfolio
- `GET /api/investments` - Lista inwestycji
- `POST /api/investments` - Dodaj inwestycję
- `GET /api/portfolio/profit-loss` - Zyski/straty portfolio
- `GET /api/portfolio/historical/{days}` - Dane historyczne

### Risk Analysis
- `POST /api/risk/var-calculation` - Kalkulacja VaR i metryk ryzyka

## 🚀 Deployment

### Cloud Deployment

**Docker Hub + Cloud Platform:**

```bash
# Build i push do Docker Hub
docker build -t yourusername/budget-backend ./backend
docker build -t yourusername/budget-frontend ./frontend

docker push yourusername/budget-backend
docker push yourusername/budget-frontend
```

**Railway/Render/DigitalOcean:**
- Import docker-compose.yml
- Ustaw environment variables
- Deploy z automatic Docker builds

### Single Container Deployment

```bash
# Backend only
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:port/db \
  budget-backend

# Frontend only  
docker run -p 3000:80 budget-frontend
```

## 🔐 Security

- **Environment Variables**: Wrażliwe dane w .env files
- **CORS Configuration**: Ograniczone origins dla production
- **Nginx Security Headers**: XSS protection, content sniffing prevention
- **Health Checks**: Container monitoring dla availability

## 📈 Monitoring

```bash
# Resource usage
docker stats

# Container health
docker inspect budget_backend --format='{{.State.Health.Status}}'

# Application metrics
curl http://localhost:8000/health
```

## ❓ Troubleshooting

### Database Connection Issues
```bash
# Sprawdź czy PostgreSQL działa
docker-compose logs db

# Restart database
docker-compose restart db
```

### Backend Errors
```bash
# Sprawdź logi backend
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Build Issues
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## 📄 License

MIT License - możesz używać tego kodu w projektach komercyjnych i open source.

---

**Aplikacja gotowa do uruchomienia jedną komendą: `docker-compose up`**