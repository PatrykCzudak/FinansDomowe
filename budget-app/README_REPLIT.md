# 💰 Personal Budget Management - Replit Setup

**UWAGA**: Docker nie jest dostępny w środowisku Replit. Oto alternatywne sposoby uruchomienia projektu:

## 🚀 Opcja 1: Lokalnie z Docker (Najlepsza)

Pobierz projekt i uruchom na swoim komputerze:

```bash
# Pobierz projekt z GitHub
git clone <your-repo-url>
cd budget-app

# Uruchom z Docker
./start.sh
```

**Aplikacja będzie dostępna:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000  
- API Docs: http://localhost:8000/docs

## 🛠️ Opcja 2: Replit Development (Obecna)

W Replit używamy obecnego Node.js setup z in-memory storage:

```bash
# Uruchom w Replit
npm run dev
```

**Dostęp:** https://twoja-replit-nazwa.repl.co

**Ograniczenia w Replit:**
- ❌ Brak Docker
- ❌ Brak PostgreSQL (używa in-memory storage)
- ❌ Brak pełnej analizy ryzyka (wymaga NumPy/Pandas)
- ✅ Podstawowe funkcje budżetu działają
- ✅ UI kompletne
- ✅ Yahoo Finance API działa

## ☁️ Opcja 3: Cloud Deployment

### Frontend (Vercel)
1. Push kod na GitHub
2. Połącz Vercel z repo
3. Deploy `frontend/` folder
4. Ustaw environment variable: `VITE_API_URL=https://twój-backend.com`

### Backend (Railway/Render)
1. Deploy `backend/` folder
2. Ustaw Python runtime
3. Dodaj PostgreSQL database
4. Ustaw environment variables

## 📁 Struktura Projektu

```
budget-app/
├── backend/           # Python FastAPI (do cloud deployment)
│   ├── main.py       # Complete API with risk analysis
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/          # React TypeScript (do cloud deployment)  
│   ├── src/          # Complete UI
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml # Lokalny Docker setup
└── start.sh          # Lokalny quick start
```

## 🔧 Problemy Docker w Replit:

Problem który napotkałeś:
```
ERROR [frontend builder 4/6] RUN npm ci --only=production
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Rozwiązanie**: Docker nie działa w Replit. Musisz użyć:
1. **Lokalnie** - pobierz projekt i uruchom `./start.sh`
2. **Cloud** - deploy na Vercel (frontend) + Railway (backend)

## 🎯 Zalecane Workflow:

1. **Development w Replit**: Testuj zmiany w UI (ograniczona funkcjonalność)
2. **Production lokalnie**: Pełny Docker stack z wszystkimi funkcjami
3. **Deployment**: Cloud platforms dla production

## 💾 Pełne Funkcje (tylko Docker/Cloud):

- ✅ **PostgreSQL Database**: Trwałe dane
- ✅ **Python FastAPI**: Zaawansowane kalkulacje finansowe  
- ✅ **Risk Analysis**: VaR, Expected Shortfall, portfolio optimization
- ✅ **Real-time Data**: Yahoo Finance integration
- ✅ **Health Checks**: Monitoring i automatic restart
- ✅ **Production Ready**: Nginx, security headers, scaling

---

**Jeśli chcesz pełną funkcjonalność, pobierz projekt lokalnie i uruchom z Docker!**