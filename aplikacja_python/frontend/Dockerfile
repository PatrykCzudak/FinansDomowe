FROM node:18-alpine AS builder

WORKDIR /app

# Kopiuj pliki package.json i package-lock.json
COPY package*.json ./

# Instaluj zależności
RUN npm ci

# Kopiuj resztę kodu frontendu
COPY . .

# Zmienna środowiskowa (jeśli potrzebne, np. adres API, tutaj nie ustawiamy bo używamy relative path)
ENV VITE_API_BASE=""

# Zbuduj aplikację (plik wyjściowy w /app/dist)
RUN npm run build

# Etap produkcyjny - serwowanie statyczne przez nginx
FROM nginx:alpine

# Kopiuj z etapu budowania gotowe pliki statyczne do nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopiuj własną konfigurację nginx (jeśli potrzebna, np. dla SPA history mode)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
