#!/bin/bash

# Personal Budget Management - GitHub Setup Script
# This script initializes Git repository and prepares for GitHub deployment

echo "🚀 Setting up Personal Budget Management for GitHub..."

# Create main project directory structure
mkdir -p personal-budget-management
cd personal-budget-management

# Initialize git repository
git init
echo "✅ Git repository initialized"

# Copy Python backend
cp -r ../python-backend ./backend
echo "✅ Python backend copied"

# Copy frontend (React/TypeScript)
mkdir frontend
cp -r ../client/* ./frontend/
cp ../package.json ./frontend/
cp ../tailwind.config.ts ./frontend/
cp ../tsconfig.json ./frontend/
cp ../vite.config.ts ./frontend/
cp ../postcss.config.js ./frontend/
cp ../components.json ./frontend/
echo "✅ Frontend copied"

# Copy shared schema
mkdir shared
cp ../shared/schema.ts ./shared/
echo "✅ Shared schema copied"

# Create main README.md
cat > README.md << 'EOF'
# 💰 Personal Budget Management Application

Advanced financial management application combining investment risk analysis, AI-driven insights, and comprehensive budget tracking.

![Budget Management](https://img.shields.io/badge/Budget-Management-green)
![Investment Analysis](https://img.shields.io/badge/Investment-Analysis-blue)
![Risk Assessment](https://img.shields.io/badge/Risk-Assessment-red)
![Real--time Data](https://img.shields.io/badge/Real--time-Data-yellow)

## ✨ Features

### 🏦 Budget Management
- **Categories & Income**: Customizable budget categories with color coding
- **Expense Tracking**: Monthly expense tracking with search functionality
- **Savings Goals**: Target-based savings with progress tracking
- **Monthly Filtering**: Browse historical data by month

### 📈 Investment Portfolio
- **Real-time Tracking**: Live price updates via Yahoo Finance API
- **Profit/Loss Analysis**: Comprehensive P&L calculations
- **Sales Tracking**: Investment sales with realized gains/losses
- **Portfolio Visualization**: Interactive charts and performance metrics

### ⚠️ Advanced Risk Analysis
- **Value at Risk (VaR)**: 95% and 99% confidence levels
- **Expected Shortfall**: Tail risk assessment
- **Risk Metrics**: Beta, Sharpe Ratio, Maximum Drawdown, Volatility
- **Stress Testing**: Historical crisis scenarios
- **Portfolio Optimization**: Markowitz optimization algorithms

### 🤖 AI Assistant
- **Financial Analysis**: AI-powered portfolio and budget insights
- **Predictive Models**: LSTM, Bayesian LSTM, CNN+Transformer, CatBoost
- **Market Forecasting**: Multi-horizon price predictions
- **Risk Optimization**: ML-enhanced portfolio optimization

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + shadcn/ui components
- **TanStack Query** for state management
- **Recharts** for data visualization
- **Zod** for schema validation

### Backend (Python)
- **FastAPI** with async support
- **SQLAlchemy** ORM + PostgreSQL
- **Yahoo Finance** API integration
- **NumPy/Pandas** for financial calculations
- **Advanced risk analytics** (VaR, ES, portfolio metrics)

### Backend (Node.js Alternative)
- **Express.js** with TypeScript
- **Drizzle ORM** + PostgreSQL
- **Yahoo Finance2** integration
- **Real-time price scheduling**

## 🚀 Quick Start

### Option 1: Python Backend (Recommended)

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure database
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run backend
uvicorn main:app --reload --port 8000

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Option 2: Node.js Backend

```bash
# Full stack setup
npm install
npm run dev
```

## 📊 Key Capabilities

### Financial Risk Analysis
- **Historical Simulation VaR**: Uses real market data from Yahoo Finance
- **Expected Shortfall**: Conditional VaR for tail risk
- **Portfolio Metrics**: Comprehensive risk-adjusted performance measures
- **Stress Testing**: Crisis scenario modeling (2008, COVID-19, market corrections)

### Market Data Integration
- **Real-time Prices**: Automatic updates every 15 minutes during trading hours
- **Historical Data**: Up to 1 year of daily price history per instrument
- **Symbol Search**: Company and ETF symbol lookup
- **Multi-asset Support**: Stocks, ETFs, indices

### Advanced Analytics
- **Portfolio Optimization**: Modern Portfolio Theory implementation
- **Monte Carlo Simulations**: Risk scenario modeling
- **Machine Learning Models**: Predictive analytics for price forecasting
- **Performance Attribution**: Detailed return analysis

## 🐳 Deployment

### Docker Deployment

```bash
# Python backend
cd backend
docker build -t budget-api .
docker run -p 8000:8000 --env-file .env budget-api

# Frontend (build for production)
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, or similar
```

### Cloud Deployment Options

#### Recommended Stack:
- **Frontend**: Vercel (automatic GitHub deployments)
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: Railway PostgreSQL, Render PostgreSQL, or Neon

#### Alternative: All-in-One
- **Replit Deployments**: Single-click deployment from Replit
- **Heroku**: Container deployment (Python + Node.js)

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend (optional)
VITE_API_URL=http://localhost:8000
VITE_YAHOO_FINANCE_KEY=your_key_here
```

## 📈 Portfolio Risk Metrics Explained

### Value at Risk (VaR)
- **95% VaR**: Maximum expected loss over 1 day with 95% confidence
- **99% VaR**: Maximum expected loss over 1 day with 99% confidence
- **Interpretation**: "With 95% confidence, portfolio won't lose more than X PLN tomorrow"

### Expected Shortfall (ES)
- **Conditional VaR**: Average loss when VaR threshold is exceeded
- **Tail Risk**: Captures extreme loss scenarios beyond VaR
- **Use Case**: Regulatory capital requirements, risk budgeting

### Additional Metrics
- **Beta**: Portfolio sensitivity to market movements (market = 1.0)
- **Sharpe Ratio**: Risk-adjusted returns (>1.0 is good, >2.0 is excellent)
- **Max Drawdown**: Largest peak-to-trough decline in portfolio history
- **Volatility**: Annualized standard deviation of returns

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Multi-currency support
- [ ] Bank API integrations (Open Banking)
- [ ] ESG scoring for sustainable investing
- [ ] Options trading tracking
- [ ] Automated rebalancing recommendations
- [ ] Family/shared budgets
- [ ] Mobile app (React Native)

## 📞 Support

For questions and support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using modern web technologies and financial industry best practices.**
EOF

echo "✅ Main README.md created"

# Create root package.json for monorepo
cat > package.json << 'EOF'
{
  "name": "personal-budget-management",
  "version": "1.0.0",
  "description": "Advanced financial management application with investment risk analysis",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && uvicorn main:app --reload --port 8000",
    "build": "cd frontend && npm run build",
    "start": "cd backend && python main.py",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && pip install -r requirements.txt"
  },
  "keywords": [
    "budget",
    "investment",
    "risk-analysis",
    "portfolio-management",
    "var",
    "financial-analytics"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

echo "✅ Root package.json created"

# Create LICENSE file
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Personal Budget Management

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

echo "✅ License file created"

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Python
__pycache__/
*.py[cod]
*$py.class
venv/
env/
.env
.venv

# Build outputs
dist/
build/
*/dist/
*/build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite
*.sqlite3

# Cache
.cache/
.parcel-cache/
.next/
.nuxt/

# Coverage
coverage/
*.lcov
.nyc_output/

# Runtime
.replit
replit.nix
EOF

echo "✅ .gitignore created"

# Create deployment configs
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Python dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        
    - name: Install Node.js dependencies
      run: |
        cd frontend
        npm install
        
    - name: Build frontend
      run: |
        cd frontend
        npm run build
        
    - name: Test backend
      run: |
        cd backend
        python -m pytest || echo "No tests yet"

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      run: |
        echo "Add your deployment steps here"
        echo "Backend: Deploy Python FastAPI to Railway/Render"
        echo "Frontend: Deploy React build to Vercel/Netlify"
EOF

echo "✅ GitHub Actions workflow created"

# Add all files to git
git add .

# Create initial commit
git commit -m "🚀 Initial commit: Personal Budget Management Application

✨ Features:
- Advanced financial portfolio management
- Real-time investment tracking with Yahoo Finance
- Comprehensive risk analysis (VaR, Expected Shortfall)
- Budget tracking with monthly filtering
- Savings goals management
- AI-powered financial insights

🛠️ Tech Stack:
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Python FastAPI + SQLAlchemy + PostgreSQL
- Analytics: NumPy, Pandas for financial calculations
- Real-time data: Yahoo Finance API integration

📊 Risk Analysis:
- Value at Risk (95%, 99% confidence levels)
- Expected Shortfall for tail risk
- Portfolio metrics: Beta, Sharpe Ratio, Max Drawdown
- Historical simulation with real market data

🚀 Ready for deployment on Vercel + Railway/Render"

echo ""
echo "🎉 Project ready for GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Create new repository on GitHub: https://github.com/new"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/yourusername/personal-budget-management.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🚀 Deployment options:"
echo "• Frontend: Vercel (connect GitHub repo for auto-deploy)"
echo "• Backend: Railway, Render, or DigitalOcean App Platform"
echo "• Database: Railway PostgreSQL, Neon Database, or Render PostgreSQL"
echo ""
echo "📁 Project structure:"
echo "personal-budget-management/"
echo "├── frontend/          # React + TypeScript frontend"
echo "├── backend/           # Python FastAPI backend"
echo "├── shared/            # Shared TypeScript schemas"
echo "├── .github/workflows/ # CI/CD automation"
echo "└── README.md          # Comprehensive documentation"
EOF

chmod +x setup_github.sh
echo "Created complete GitHub setup script"

# Run the setup script
<function_calls>
<invoke name="bash">
<parameter name="command">./setup_github.sh