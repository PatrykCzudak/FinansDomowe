from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Float, Date, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import os
import yfinance as yf
import numpy as np
import pandas as pd
from apscheduler.schedulers.background import BackgroundScheduler
import uvicorn

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://budget_user:budget_pass@db:5432/budget_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    name = Column(String, nullable=False)
    color = Column(String, nullable=False, default="#3B82F6")
    budget = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Income(Base):
    __tablename__ = "incomes"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    frequency = Column(String, nullable=False, default="monthly")
    date = Column(Date, nullable=False, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category_id = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Investment(Base):
    __tablename__ = "investments"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    symbol = Column(String, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    current_price = Column(Float)
    purchase_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SavingsGoal(Base):
    __tablename__ = "savings_goals"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    name = Column(String, nullable=False)
    description = Column(Text)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, nullable=False, default=0)
    target_date = Column(Date)
    category = Column(String, nullable=False)
    color = Column(String, nullable=False, default="#3B82F6")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SavingsTransaction(Base):
    __tablename__ = "savings_transactions"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    savings_goal_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class InvestmentSale(Base):
    __tablename__ = "investment_sales"
    id = Column(String, primary_key=True, default=func.gen_random_uuid())
    investment_id = Column(String, nullable=False)
    investment_symbol = Column(String, nullable=False)
    investment_name = Column(String, nullable=False)
    quantity_sold = Column(Float, nullable=False)
    sale_price = Column(Float, nullable=False)
    total_sale_value = Column(Float, nullable=False)
    profit_loss = Column(Float, nullable=False)
    sale_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic models
class CategoryCreate(BaseModel):
    name: str
    color: str = "#3B82F6"
    budget: float

class CategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    budget: float
    created_at: datetime

class IncomeCreate(BaseModel):
    name: str
    amount: float
    frequency: str = "monthly"
    date: date

class IncomeResponse(BaseModel):
    id: str
    name: str
    amount: float
    frequency: str
    date: date
    created_at: datetime

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    category_id: str
    date: date

class ExpenseResponse(BaseModel):
    id: str
    description: str
    amount: float
    category_id: str
    date: date
    created_at: datetime

class InvestmentCreate(BaseModel):
    symbol: str
    name: str
    type: str
    quantity: float
    purchase_price: float
    purchase_date: date

class InvestmentResponse(BaseModel):
    id: str
    symbol: str
    name: str
    type: str
    quantity: float
    purchase_price: float
    current_price: Optional[float]
    purchase_date: date
    created_at: datetime

class SavingsGoalCreate(BaseModel):
    name: str
    description: Optional[str]
    target_amount: float
    target_date: Optional[date]
    category: str
    color: str = "#3B82F6"

class SavingsGoalResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    target_amount: float
    current_amount: float
    target_date: Optional[date]
    category: str
    color: str
    is_active: bool
    created_at: datetime

# Create FastAPI app
app = FastAPI(title="Personal Budget Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Price service using yfinance
class PriceService:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(
            func=self.update_all_prices,
            trigger="interval",
            minutes=15,
            id="price_update_job"
        )
        self.scheduler.start()
    
    def get_price(self, symbol: str) -> Optional[float]:
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")
            if not data.empty:
                return float(data['Close'].iloc[-1])
            return None
        except Exception as e:
            print(f"Error fetching price for {symbol}: {e}")
            return None
    
    def update_all_prices(self):
        try:
            db = SessionLocal()
            investments = db.query(Investment).all()
            for investment in investments:
                price = self.get_price(investment.symbol)
                if price:
                    investment.current_price = price
            db.commit()
            db.close()
            print(f"Updated prices for {len(investments)} investments")
        except Exception as e:
            print(f"Error updating prices: {e}")
    
    def search_symbol(self, query: str):
        try:
            import yfinance as yf
            ticker = yf.Ticker(query)
            info = ticker.info
            return [{
                'symbol': query,
                'longName': info.get('longName', query),
                'industry': info.get('industry', ''),
                'sector': info.get('sector', '')
            }]
        except:
            return []

price_service = PriceService()

# Risk calculation utilities
def calculate_var_es(returns: List[float], confidence_levels: List[float] = [0.95, 0.99]):
    """Calculate VaR and Expected Shortfall"""
    if not returns:
        return {}
    
    returns_array = np.array(returns)
    results = {}
    
    for conf in confidence_levels:
        # VaR calculation
        var_percentile = (1 - conf) * 100
        var_value = np.percentile(returns_array, var_percentile)
        results[f'var_{int(conf*100)}'] = var_value
        
        # Expected Shortfall (CVaR)
        tail_returns = returns_array[returns_array <= var_value]
        if len(tail_returns) > 0:
            es_value = np.mean(tail_returns)
        else:
            es_value = var_value
        results[f'es_{int(conf*100)}'] = es_value
    
    return results

def calculate_risk_metrics(returns: List[float]):
    """Calculate additional risk metrics"""
    if not returns:
        return {}
    
    returns_array = np.array(returns)
    
    # Volatility (annualized)
    volatility = np.std(returns_array) * np.sqrt(252)
    
    # Sharpe ratio (assuming 2% risk-free rate)
    risk_free_rate = 0.02
    mean_return = np.mean(returns_array) * 252
    sharpe_ratio = (mean_return - risk_free_rate) / volatility if volatility > 0 else 0
    
    # Maximum drawdown
    cumulative_returns = np.cumprod(1 + returns_array)
    running_max = np.maximum.accumulate(cumulative_returns)
    drawdowns = (cumulative_returns - running_max) / running_max
    max_drawdown = np.min(drawdowns)
    
    # Beta (simplified - using market correlation)
    beta = 1.0  # Simplified assumption
    
    return {
        'volatility': volatility,
        'sharpe_ratio': sharpe_ratio,
        'max_drawdown': abs(max_drawdown),
        'beta': beta
    }

async def get_portfolio_historical(days: int, db: Session):
    """Get portfolio historical data for risk analysis"""
    investments = db.query(Investment).all()
    if not investments:
        return []
    
    # Calculate portfolio weights
    total_value = sum(
        (inv.current_price or inv.purchase_price) * inv.quantity 
        for inv in investments
    )
    
    portfolio_data = []
    for inv in investments:
        weight = ((inv.current_price or inv.purchase_price) * inv.quantity) / total_value
        try:
            ticker = yf.Ticker(inv.symbol)
            hist = ticker.history(period=f"{days}d")
            if not hist.empty:
                portfolio_data.append({
                    'symbol': inv.symbol,
                    'weight': weight,
                    'data': [
                        {
                            'date': date.strftime('%Y-%m-%d'),
                            'close': close,
                            'volume': volume
                        }
                        for date, close, volume in zip(hist.index, hist['Close'], hist['Volume'])
                    ]
                })
        except Exception as e:
            print(f"Error fetching data for {inv.symbol}: {e}")
    
    # Calculate portfolio time series
    if not portfolio_data:
        return []
    
    # Find common dates
    all_dates = set()
    for stock in portfolio_data:
        for point in stock['data']:
            all_dates.add(point['date'])
    
    common_dates = sorted(list(all_dates))[-days:]  # Get last 'days' dates
    
    portfolio_time_series = []
    total_weight = sum(stock['weight'] for stock in portfolio_data)
    
    for date_str in common_dates:
        portfolio_value = 0
        valid_data = True
        
        for stock in portfolio_data:
            day_data = next((d for d in stock['data'] if d['date'] == date_str), None)
            if day_data and stock['weight'] > 0:
                normalized_weight = stock['weight'] / total_weight
                portfolio_value += day_data['close'] * normalized_weight * total_weight
            else:
                valid_data = False
                break
        
        if valid_data:
            portfolio_time_series.append({
                'date': date_str,
                'portfolioValue': portfolio_value
            })
    
    # Calculate returns
    for i in range(1, len(portfolio_time_series)):
        current = portfolio_time_series[i]
        previous = portfolio_time_series[i-1]
        
        returns = (current['portfolioValue'] - previous['portfolioValue']) / previous['portfolioValue']
        cumulative_returns = (current['portfolioValue'] - portfolio_time_series[0]['portfolioValue']) / portfolio_time_series[0]['portfolioValue']
        
        current['returns'] = returns
        current['cumulativeReturns'] = cumulative_returns
    
    if portfolio_time_series:
        portfolio_time_series[0]['returns'] = 0
        portfolio_time_series[0]['cumulativeReturns'] = 0
    
    return portfolio_time_series

# API Routes
@app.on_event("startup")
async def startup_event():
    create_tables()
    print("Database tables created successfully")

@app.get("/")
async def root():
    return {"message": "Personal Budget Management API"}

# Categories endpoints
@app.get("/api/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@app.post("/api/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.put("/api/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: str, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Income endpoints
@app.get("/api/incomes", response_model=List[IncomeResponse])
async def get_incomes(db: Session = Depends(get_db)):
    incomes = db.query(Income).all()
    return incomes

@app.post("/api/incomes", response_model=IncomeResponse)
async def create_income(income: IncomeCreate, db: Session = Depends(get_db)):
    db_income = Income(**income.dict())
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

# Expenses endpoints
@app.get("/api/expenses", response_model=List[ExpenseResponse])
async def get_expenses(
    category_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Expense)
    
    if category_id:
        query = query.filter(Expense.category_id == category_id)
    if start_date and end_date:
        query = query.filter(Expense.date.between(start_date, end_date))
    
    expenses = query.all()
    return expenses

@app.post("/api/expenses", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

# Investments endpoints
@app.get("/api/investments", response_model=List[InvestmentResponse])
async def get_investments(db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    return investments

@app.post("/api/investments", response_model=InvestmentResponse)
async def create_investment(investment: InvestmentCreate, db: Session = Depends(get_db)):
    db_investment = Investment(**investment.dict())
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

# Savings Goals endpoints
@app.get("/api/savings-goals", response_model=List[SavingsGoalResponse])
async def get_savings_goals(db: Session = Depends(get_db)):
    goals = db.query(SavingsGoal).all()
    return goals

@app.post("/api/savings-goals", response_model=SavingsGoalResponse)
async def create_savings_goal(goal: SavingsGoalCreate, db: Session = Depends(get_db)):
    db_goal = SavingsGoal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

# Price service endpoints
@app.get("/api/prices/update")
async def update_prices():
    price_service.update_all_prices()
    return {"message": "Ceny zostały zaktualizowane"}

@app.get("/api/prices/{symbol}")
async def get_price(symbol: str):
    price = price_service.get_price(symbol)
    if price is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono ceny dla symbolu")
    return {"symbol": symbol, "price": price}

@app.get("/api/search/{query}")
async def search_symbol(query: str):
    results = price_service.search_symbol(query)
    return results

# Risk analysis endpoints
@app.get("/api/portfolio/historical/{days}")
async def get_portfolio_historical_data(days: int, db: Session = Depends(get_db)):
    data = await get_portfolio_historical(days, db)
    return data

@app.post("/api/risk/var-calculation")
async def calculate_var(
    confidence_level: float = 0.95,
    time_horizon: int = 1,
    db: Session = Depends(get_db)
):
    """Calculate VaR and ES for the portfolio"""
    try:
        # Get portfolio historical data
        historical_data = await get_portfolio_historical(252, db)  # 1 year of data
        
        if not historical_data:
            raise HTTPException(status_code=400, detail="No historical data available")
        
        # Extract returns
        returns = [point.get('returns', 0) for point in historical_data if 'returns' in point]
        
        if len(returns) < 30:
            raise HTTPException(status_code=400, detail="Insufficient data for VaR calculation")
        
        # Calculate VaR and ES
        var_es_results = calculate_var_es(returns, [confidence_level, 0.99])
        
        # Calculate additional risk metrics
        risk_metrics = calculate_risk_metrics(returns)
        
        # Get current portfolio value
        investments = db.query(Investment).all()
        current_value = sum(
            (inv.current_price or inv.purchase_price) * inv.quantity 
            for inv in investments
        ) or 10000
        
        # Convert to monetary values
        result = {
            'var95': var_es_results.get('var_95', 0) * current_value,
            'var99': var_es_results.get('var_99', 0) * current_value,
            'expectedShortfall95': var_es_results.get('es_95', 0) * current_value,
            'expectedShortfall99': var_es_results.get('es_99', 0) * current_value,
            'confidenceLevel': confidence_level,
            'timeHorizon': time_horizon,
            'currentValue': current_value,
            **risk_metrics
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating VaR: {str(e)}")

# AI Assistant endpoints
@app.get("/api/ai/analyze/portfolio")
async def analyze_portfolio(db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    
    if not investments:
        return {
            'type': 'portfolio',
            'title': 'Portfolio jest puste',
            'content': 'Nie masz jeszcze żadnych inwestycji. Rozważ dodanie pierwszych instrumentów finansowych do swojego portfolio.',
            'confidence': 1.0
        }
    
    total_value = sum((inv.current_price or inv.purchase_price) * inv.quantity for inv in investments)
    
    analysis = f"""**Analiza Portfolio:**

Wartość całkowita: {total_value:,.2f} PLN
Liczba pozycji: {len(investments)}

**Dywersyfikacja:**
"""
    
    for inv in investments:
        value = (inv.current_price or inv.purchase_price) * inv.quantity
        percentage = (value / total_value * 100) if total_value > 0 else 0
        analysis += f"- {inv.name} ({inv.symbol}): {percentage:.1f}% ({value:,.2f} PLN)\n"
    
    return {
        'type': 'portfolio',
        'title': 'Analiza Portfolio',
        'content': analysis,
        'confidence': 0.8
    }

@app.get("/api/ai/analyze/budget")
async def analyze_budget(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    expenses = db.query(Expense).all()
    incomes = db.query(Income).all()
    
    current_month = datetime.now().strftime('%Y-%m')
    monthly_expenses = [exp for exp in expenses if exp.date.strftime('%Y-%m') == current_month]
    
    total_income = sum(inc.amount for inc in incomes)
    total_spent = sum(exp.amount for exp in monthly_expenses)
    total_budget = sum(cat.budget for cat in categories)
    
    analysis = f"""**Analiza Budżetu:**

Przychody miesięczne: {total_income:,.2f} PLN
Wydatki w tym miesiącu: {total_spent:,.2f} PLN
Całkowity budżet: {total_budget:,.2f} PLN
Pozostało do wydania: {total_budget - total_spent:,.2f} PLN

**Status budżetu:** {'✅ W normie' if total_spent <= total_budget else '❌ Przekroczony'}
"""
    
    return {
        'type': 'budget',
        'title': 'Analiza Budżetu',
        'content': analysis,
        'confidence': 0.9
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)