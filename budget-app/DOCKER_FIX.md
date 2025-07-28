# 🔧 Docker Build Fix

## Problem

```
ERROR [frontend builder 4/6] RUN npm ci --only=production
npm error The `npm ci` command can only install with an existing package-lock.json
```

## ✅ Rozwiązanie

Problem został naprawiony w `frontend/Dockerfile`:

### Przed (błędne):
```dockerfile
COPY package*.json ./
RUN npm ci --only=production
```

### Po (poprawione):
```dockerfile  
COPY package.json ./
RUN npm install
```

## Dodatkowe poprawki:

1. **Usunięto `npm ci`** - zastąpiono `npm install`
2. **Dodano `.dockerignore`** files dla frontend i backend
3. **Zaktualizowano dependencies** w `package.json`
4. **Poprawiono Docker Compose commands** na nową składnię

## Test lokalnie:

```bash
cd budget-app

# Build tylko frontend
docker build -t budget-frontend ./frontend

# Build cały stack  
docker compose build

# Uruchom
./start.sh
```

## Pliki które zostały naprawione:

- ✅ `frontend/Dockerfile` - poprawiony build process
- ✅ `frontend/.dockerignore` - ignorowane pliki  
- ✅ `backend/.dockerignore` - ignorowane pliki
- ✅ `frontend/package.json` - dodane missing dependencies
- ✅ `start.sh` - nowa składnia Docker Compose
- ✅ `stop.sh` - nowa składnia Docker Compose

**Problem rozwiązany! Docker build będzie działać lokalnie.**