# 🚀 Instrukcja: Jak wysłać projekt na GitHub

## Krok 1: Stwórz nowe repozytorium na GitHub

1. **Idź na GitHub**: https://github.com/new
2. **Nazwa repozytorium**: `personal-budget-management`
3. **Opis**: `Advanced financial management with Python FastAPI backend and React frontend`
4. **Widoczność**: Public (lub Private jeśli wolisz)
5. **NIE ZAZNACZAJ**: "Add a README file" (już mamy)
6. **NIE ZAZNACZAJ**: "Add .gitignore" (już mamy)
7. **Kliknij**: "Create repository"

## Krok 2: Skopiuj URL swojego repo

Po stworzeniu repo, GitHub pokaże Ci instrukcje. **Skopiuj URL** który wygląda tak:
```
https://github.com/TWOJA-NAZWA-UŻYTKOWNIKA/personal-budget-management.git
```

## Krok 3: Połącz lokalny projekt z GitHub

W Replit, w terminalu wpisz te komendy **jedna po drugiej**:

```bash
# Przejdź do folderu projektu
cd /home/runner/workspace/personal-budget-management

# Dodaj remote repository (wstaw SWÓJ URL tutaj)
git remote add origin https://github.com/TWOJA-NAZWA-UŻYTKOWNIKA/personal-budget-management.git

# Wyślij kod na GitHub
git push -u origin main
```

**WAŻNE**: Zamień `TWOJA-NAZWA-UŻYTKOWNIKA` na swoją prawdziwą nazwę użytkownika GitHub!

## Krok 4: Weryfikacja

Po wysłaniu, odśwież stronę swojego repo na GitHub. Powinieneś zobaczyć:
- ✅ Wszystkie pliki projektu
- ✅ README.md z pełną dokumentacją
- ✅ Folder `backend/` z Python FastAPI
- ✅ Folder `frontend/` z React + TypeScript
- ✅ GitHub Actions workflow

## Krok 5: Deployment (opcjonalnie)

### Frontend na Vercel:
1. Idź na vercel.com
2. "Import Git Repository"
3. Wybierz swoje repo
4. Build Command: `cd frontend && npm run build`
5. Output Directory: `frontend/dist`

### Backend na Railway:
1. Idź na railway.app
2. "Deploy from GitHub repo"
3. Wybierz swoje repo
4. Root Directory: `backend`
5. Dodaj PostgreSQL database

## Możliwe problemy:

### Problem: "Permission denied"
```bash
# Jeśli masz problem z dostępem, użyj Personal Access Token
# GitHub Settings -> Developer settings -> Personal access tokens
```

### Problem: "Repository not found"
```bash
# Sprawdź czy URL jest poprawny i czy repo istnieje
git remote -v
```

### Problem: "Authentication failed"
```bash
# Użyj Personal Access Token zamiast hasła
# Username: twoja-nazwa
# Password: ghp_xxxxxxxxxxxx (token)
```

---

**Gotowe!** Po wysłaniu będziesz mieć profesjonalny projekt na GitHub z pełną dokumentacją i gotowy do deployment.