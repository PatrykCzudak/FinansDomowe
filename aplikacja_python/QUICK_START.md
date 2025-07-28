# 🚀 Aplikacja Budżetowa Python - Szybki Start

## Przegląd

Kompletna aplikacja zarządzania budżetem osobistym z analizą inwestycji, analizą ryzyka VaR i asystentem AI. Wersja Python używa FastAPI backend + React frontend.

## ⚡ Szybkie uruchomienie

### Opcja 1: Skrypt automatyczny (zalecana)
```bash
cd aplikacja_python
python run_local.py
```

### Opcja 2: Uruchomienie ręczne

#### Backend Python FastAPI:
```bash
cd aplikacja_python/backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv yfinance pandas numpy
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend React:
```bash
cd aplikacja_python/frontend
npm install
npm run dev -- --port 3000
```

## 🌐 Dostęp do aplikacji

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Dokumentacja**: http://localhost:8000/docs
- **Baza danych**: PostgreSQL (automatycznie skonfigurowana)

## ✨ Funkcjonalności

### 💰 Zarządzanie budżetem
- Kategorie z kolorami i limitami budżetowymi
- Przychody (miesięczne, tygodniowe, jednorazowe)
- Wydatki z przypisaniem do kategorii
- Cele oszczędnościowe z śledzeniem postępu

### 📈 Portfel inwestycyjny  
- Śledzenie akcji, ETF, obligacji
- Automatyczne aktualizacje cen z Yahoo Finance (co 15 min)
- Wykresy alokacji i wydajności
- Analiza zysków/strat

### ⚠️ Analiza ryzyka
- **Value at Risk (VaR)** - 95% i 99% poziom ufności
- **Expected Shortfall** - analiza ryzyka ogonowego
- **Metryki ryzyka** - Beta, Sharpe Ratio, Maximum Drawdown
- **Stress testing** - scenariusze kryzysów historycznych

### 🤖 Asystent AI
- Analiza portfela i budżetu
- Rekomendacje inwestycyjne
- Modele predykcyjne (LSTM, CNN+Transformer, CatBoost)
- Optymalizacja portfela Markowitza

### 📊 Wizualizacje
- Wykresy wydatków i przychodów
- Trendy finansowe
- Alokacja portfela
- Analiza wydajności inwestycji

## 🔧 Wymagania techniczne

### Python Backend
- Python 3.8+
- FastAPI
- SQLAlchemy + PostgreSQL
- yfinance (dane rynkowe)
- pandas, numpy (analiza danych)

### React Frontend  
- Node.js 16+
- React 18 + TypeScript
- Tailwind CSS
- TanStack Query
- Recharts (wykresy)

## 🗄️ Baza danych

Aplikacja automatycznie tworzy tabele PostgreSQL:
- `categories` - kategorie budżetowe
- `incomes` - źródła przychodów
- `expenses` - wydatki
- `investments` - pozycje inwestycyjne
- `savings_goals` - cele oszczędnościowe

## 🌍 Integracje zewnętrzne

- **Yahoo Finance API** - ceny akcji i danych rynkowych w czasie rzeczywistym
- **PostgreSQL** - trwałe przechowywanie danych
- **Scheduler** - automatyczne aktualizacje cen co 15 minut

## 🛑 Zatrzymanie aplikacji

### Skrypt automatyczny:
```bash
Ctrl+C  # w terminalu ze skryptem run_local.py
```

### Ręcznie:
```bash
# Zatrzymaj procesy
pkill -f uvicorn
pkill -f "npm run dev"
```

## 📝 Rozwiązywanie problemów

### Backend nie startuje:
```bash
# Sprawdź zależności
pip list | grep fastapi

# Sprawdź bazę danych
echo $DATABASE_URL
```

### Frontend nie ładuje danych:
```bash
# Sprawdź czy backend działa
curl http://localhost:8000/api/categories

# Sprawdź konfigurację API w frontend/src/lib/queryClient.ts
```

### Błędy bazy danych:
```bash
# Sprawdź tabele
python -c "from backend.database import init_db; init_db()"
```

## 🎯 Gotowe funkcjonalności

✅ Kompletne API FastAPI z wszystkimi endpointami  
✅ Integracja z PostgreSQL i automatyczne tworzenie tabel  
✅ Frontend React z komunikacją z Python backend  
✅ Automatyczne aktualizacje cen Yahoo Finance  
✅ Analiza ryzyka VaR z prawdziwymi danymi  
✅ Asystent AI z analizą portfela  
✅ Skrypt automatycznego uruchomienia  

## 📚 Więcej informacji

- **Dokumentacja API**: http://localhost:8000/docs (po uruchomieniu backendu)
- **Architektura**: Sprawdź `README.md` w głównym folderze projektu
- **Docker**: Zobacz `docker-compose.yml` dla produkcyjnego wdrożenia