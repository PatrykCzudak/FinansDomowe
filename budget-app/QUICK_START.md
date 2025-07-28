# 🚀 QUICK START - Personal Budget Management

## Uruchomienie w 30 sekund

```bash
# 1. Sklonuj/pobierz projekt
cd budget-app

# 2. Uruchom aplikację
./start.sh
```

**To wszystko!** Aplikacja będzie dostępna pod:
- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Co zostanie utworzone automatycznie

✅ **PostgreSQL Database** (automatycznie inicjalizowana)  
✅ **Python FastAPI Backend** (z analizą ryzyka)  
✅ **React Frontend** (kompletny UI)  
✅ **Docker Containers** (izolowane środowisko)  

## Zatrzymanie aplikacji

```bash
./stop.sh
```

## Funkcje

### 💰 Budget Management
- Kategorie budżetowe z kolorami
- Śledzenie wydatków miesięcznych  
- Cele oszczędnościowe
- Przychody i ich częstotliwość

### 📈 Investment Portfolio
- Prawdziwe ceny z Yahoo Finance
- Zyski/straty w czasie rzeczywistym
- Historia portfolio
- Sprzedaż inwestycji z trackingiem P&L

### ⚠️ Advanced Risk Analysis
- **Value at Risk (VaR)**: 95% i 99% poziomy ufności
- **Expected Shortfall**: Analiza ryzyka ogona  
- **Portfolio Metrics**: Beta, Sharpe Ratio, Max Drawdown, Volatility
- **Historyczna symulacja** z rzeczywistymi danymi rynkowymi

### 🤖 AI Assistant
- Analiza portfolio i budżetu
- Rekomendacje finansowe
- Modele predykcyjne (LSTM, CNN, CatBoost)

## Wymagania systemowe

- **Docker** (dowolna wersja)
- **Docker Compose**
- **4GB RAM** (zalecane)
- **2GB miejsca** na dysku

## Struktura projektu

```
budget-app/
├── backend/           # Python FastAPI + PostgreSQL
├── frontend/          # React + TypeScript + Tailwind
├── docker-compose.yml # Orchestracja kontenerów
├── start.sh          # Start aplikacji
└── stop.sh           # Stop aplikacji
```

## Troubleshooting

### Problem: "Docker not running"
```bash
# Start Docker Desktop lub Docker service
sudo systemctl start docker  # Linux
```

### Problem: "Port already in use"  
```bash
# Zmień porty w docker-compose.yml
ports:
  - "3001:80"    # Frontend
  - "8001:8000"  # Backend
  - "5433:5432"  # Database
```

### Problem: Containers not starting
```bash
# Sprawdź logi
docker-compose logs

# Restart wszystko
docker-compose down
docker-compose up -d --build
```

---

**Gotowe do użycia w produkcji z pełną dokumentacją API, health checks i monitoring!**