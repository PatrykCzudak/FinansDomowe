# Personal Budget Management API - Python Backend

Advanced financial management backend built with FastAPI, featuring investment risk analysis, portfolio tracking, and comprehensive budget management.

## Features

- **Budget Management**: Categories, income tracking, expense management
- **Investment Portfolio**: Real-time price updates via Yahoo Finance
- **Risk Analysis**: VaR (Value at Risk), Expected Shortfall, portfolio metrics
- **Savings Goals**: Target-based savings tracking
- **Real-time Data**: Historical portfolio performance and market data

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Market Data**: Yahoo Finance API (yfinance)
- **Analytics**: NumPy, Pandas, SciPy for risk calculations
- **API Documentation**: Automatic OpenAPI/Swagger docs

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd python-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Set up PostgreSQL database
createdb budgetdb

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Run the Application

```bash
# Development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

## API Endpoints

### Budget Management
- `GET /api/categories` - List all budget categories
- `POST /api/categories` - Create new category
- `GET /api/incomes` - List all income sources
- `POST /api/incomes` - Add new income
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Add new expense

### Investment Portfolio
- `GET /api/investments` - List all investments
- `POST /api/investments` - Add new investment
- `GET /api/portfolio/profit-loss` - Get total P&L
- `GET /api/portfolio/historical/{days}` - Get historical performance
- `POST /api/investments/update-prices` - Update current prices

### Risk Analysis
- `POST /api/risk/var-calculation` - Calculate VaR and risk metrics

### Savings Goals
- `GET /api/savings-goals` - List savings goals
- `POST /api/savings-goals` - Create new savings goal

## Risk Analysis Features

### Value at Risk (VaR)
- Historical simulation methodology
- 95% and 99% confidence levels
- Daily and multi-period calculations

### Expected Shortfall (ES)
- Conditional Value at Risk
- Tail risk assessment
- Portfolio stress testing

### Portfolio Metrics
- **Beta**: Market sensitivity
- **Sharpe Ratio**: Risk-adjusted returns
- **Maximum Drawdown**: Historical peak-to-trough loss
- **Volatility**: Annualized standard deviation

## Data Sources

- **Yahoo Finance**: Real-time and historical market data
- **PostgreSQL**: Persistent data storage
- **User Input**: Manual portfolio and budget entries

## Deployment

### Docker Deployment

```bash
# Build image
docker build -t budget-api .

# Run container
docker run -p 8000:8000 --env-file .env budget-api
```

### Cloud Deployment Options

1. **Railway**: Connect GitHub repo, automatic deployments
2. **Render**: Web service deployment with PostgreSQL addon
3. **Heroku**: Container deployment with Heroku Postgres
4. **DigitalOcean**: App Platform deployment

## Development

### Database Migrations

```bash
# Install Alembic for migrations
pip install alembic

# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Architecture

```
python-backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── Dockerfile          # Container configuration
├── .env.example        # Environment template
└── README.md           # Documentation
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.