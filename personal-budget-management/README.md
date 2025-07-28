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
