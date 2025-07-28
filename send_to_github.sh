#!/bin/bash

echo "🚀 Wysyłanie projektu na GitHub..."
echo ""
echo "⚠️  UWAGA: Najpierw stwórz repo na GitHub:"
echo "   1. Idź na: https://github.com/new"
echo "   2. Nazwa: personal-budget-management"
echo "   3. NIE dodawaj README ani .gitignore"
echo "   4. Skopiuj URL repo"
echo ""
echo "Potem uruchom te komendy:"
echo ""

cd /home/runner/workspace/personal-budget-management

echo "# Sprawdź status git:"
echo "git status"
git status

echo ""
echo "# Dodaj remote origin (zamień URL na swój):"
echo 'git remote add origin https://github.com/TWOJA-NAZWA/personal-budget-management.git'

echo ""
echo "# Wyślij na GitHub:"
echo "git push -u origin main"

echo ""
echo "📁 Pliki do wysłania:"
ls -la

echo ""
echo "🎯 Po stworzeniu repo na GitHub, skopiuj URL i uruchom:"
echo "git remote add origin [TWÓJ-URL]"
echo "git push -u origin main"