from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Float, DateTime, Boolean, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError
from pydantic import BaseModel
from typing import List, Optional
import os
import time
from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import numpy as np
import uuid

# Database setup with retry logic
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@db:5432/budgetdb")

def create_db_engine():
    engine = create_engine(DATABASE_URL)
    # Wait for database to be ready
    for i in range(30):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            break
        except OperationalError as e:
            print(f"⏳ Waiting for database... ({i+1}/30)")
            time.sleep(2)
    return engine

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(title="Personal Budget Management API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)
    budget = Column(Float, nullable=False)

class Income(Base):
    __tablename__ = "incomes"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    frequency = Column(String, nullable=False)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category_id = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)

class Investment(Base):
    __tablename__ = "investments"
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=True)
    purchase_date = Column(DateTime, nullable=False)

class SavingsGoal(Base):
    __tablename__ = "savings_goals"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(DateTime, nullable=False)
    category = Column(String, nullable=False)
    color = Column(String, nullable=False)

# Pydantic Models
class CategoryCreate(BaseModel):
    name: str
    color: str
    budget: float

class CategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    budget: float

class IncomeCreate(BaseModel):
    name: str
    amount: float
    frequency: str

class IncomeResponse(BaseModel):
    id: str
    name: str
    amount: float
    frequency: str

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    category_id: str
    date: datetime

class ExpenseResponse(BaseModel):
    id: str
    description: str
    amount: float
    category_id: str
    date: datetime

class InvestmentCreate(BaseModel):
    symbol: str
    name: str
    quantity: float
    purchase_price: float
    purchase_date: datetime

class InvestmentResponse(BaseModel):
    id: str
    symbol: str
    name: str
    quantity: float
    purchase_price: float
    current_price: Optional[float]
    purchase_date: datetime

class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: float
    target_date: datetime
    category: str
    color: str

class SavingsGoalResponse(BaseModel):
    id: str
    name: str
    target_amount: float
    current_amount: float
    target_date: datetime
    category: str
    color: str

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_id():
    return str(uuid.uuid4())

# Risk calculation functions
def calculate_var_es(returns: List[float], confidence_levels: List[float] = [0.95, 0.99]):
    if not returns:
        return {}
    
    returns_array = np.array(returns)
    result = {}
    
    for confidence in confidence_levels:
        var_percentile = (1 - confidence) * 100
        var = np.percentile(returns_array, var_percentile)
        
        tail_losses = returns_array[returns_array <= var]
        es = np.mean(tail_losses) if len(tail_losses) > 0 else var
        
        result[f'var_{int(confidence*100)}'] = float(var)
        result[f'es_{int(confidence*100)}'] = float(es)
    
    return result

def calculate_risk_metrics(returns: List[float]):
    if not returns:
        return {}
    
    returns_array = np.array(returns)
    
    volatility = np.std(returns_array) * np.sqrt(252)
    risk_free_rate = 0.02
    excess_returns = np.mean(returns_array) * 252 - risk_free_rate
    sharpe_ratio = excess_returns / volatility if volatility > 0 else 0
    
    cumulative_returns = np.cumprod(1 + returns_array)
    running_max = np.maximum.accumulate(cumulative_returns)
    drawdown = (cumulative_returns - running_max) / running_max
    max_drawdown = np.min(drawdown)
    
    return {
        'volatility': float(volatility),
        'sharpe_ratio': float(sharpe_ratio),
        'max_drawdown': float(abs(max_drawdown)),
        'beta': 1.0
    }

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Personal Budget Management API", "status": "running", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Categories
@app.get("/api/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@app.post("/api/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(
        id=generate_id(),
        name=category.name,
        color=category.color,
        budget=category.budget
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Incomes
@app.get("/api/incomes", response_model=List[IncomeResponse])
async def get_incomes(db: Session = Depends(get_db)):
    incomes = db.query(Income).all()
    return incomes

@app.post("/api/incomes", response_model=IncomeResponse)
async def create_income(income: IncomeCreate, db: Session = Depends(get_db)):
    db_income = Income(
        id=generate_id(),
        name=income.name,
        amount=income.amount,
        frequency=income.frequency
    )
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

@app.delete("/api/incomes/{income_id}")
async def delete_income(income_id: str, db: Session = Depends(get_db)):
    income = db.query(Income).filter(Income.id == income_id).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    db.delete(income)
    db.commit()
    return {"message": "Income deleted successfully"}

# Expenses
@app.get("/api/expenses", response_model=List[ExpenseResponse])
async def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    return expenses

@app.post("/api/expenses", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(
        id=generate_id(),
        description=expense.description,
        amount=expense.amount,
        category_id=expense.category_id,
        date=expense.date
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.delete("/api/expenses/{expense_id}")
async def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

# Investments
@app.get("/api/investments", response_model=List[InvestmentResponse])
async def get_investments(db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    return investments

@app.post("/api/investments", response_model=InvestmentResponse)
async def create_investment(investment: InvestmentCreate, db: Session = Depends(get_db)):
    db_investment = Investment(
        id=generate_id(),
        symbol=investment.symbol,
        name=investment.name,
        quantity=investment.quantity,
        purchase_price=investment.purchase_price,
        purchase_date=investment.purchase_date
    )
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

@app.get("/api/portfolio/profit-loss")
async def get_portfolio_profit_loss(db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    total_profit_loss = 0.0
    
    for investment in investments:
        if investment.current_price is not None:
            profit_loss = (investment.current_price - investment.purchase_price) * investment.quantity
            total_profit_loss += profit_loss
    
    return {"totalProfitLoss": total_profit_loss}

@app.get("/api/portfolio/historical/{days}")
async def get_portfolio_historical(days: int, db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    
    if not investments:
        return []
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days + 30)
    
    portfolio_data = []
    
    for investment in investments:
        try:
            ticker = yf.Ticker(investment.symbol)
            hist = ticker.history(start=start_date, end=end_date)
            
            if not hist.empty:
                hist_data = []
                for date, row in hist.iterrows():
                    hist_data.append({
                        'date': str(date)[:19],  # Convert to string and truncate to datetime format
                        'close': float(row['Close']),
                        'weight': investment.quantity * investment.purchase_price
                    })
                
                portfolio_data.append({
                    'symbol': investment.symbol,
                    'data': hist_data,
                    'weight': investment.quantity * investment.purchase_price
                })
        except Exception as e:
            print(f"Error fetching data for {investment.symbol}: {e}")
            continue
    
    if not portfolio_data:
        return []
    
    all_dates = set()
    for stock in portfolio_data:
        for point in stock['data']:
            all_dates.add(point['date'])
    
    common_dates = sorted(list(all_dates))[-days:]
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

@app.post("/api/risk/var-calculation")
async def calculate_var(confidence_level: float = 0.95, time_horizon: int = 1, db: Session = Depends(get_db)):
    try:
        historical_data = await get_portfolio_historical(252, db)
        
        if not historical_data:
            raise HTTPException(status_code=400, detail="No historical data available")
        
        returns = [point.get('returns', 0) for point in historical_data if 'returns' in point]
        
        if len(returns) < 30:
            raise HTTPException(status_code=400, detail="Insufficient data for VaR calculation")
        
        var_es_results = calculate_var_es(returns, [confidence_level, 0.99])
        risk_metrics = calculate_risk_metrics(returns)
        
        investments = db.query(Investment).all()
        current_value = 0
        for inv in investments:
            current_price = getattr(inv, 'current_price', None)
            # Ensure proper handling of None values
            if current_price is not None:
                price = current_price
            else:
                price = inv.purchase_price
            current_value += price * inv.quantity
        
        if float(current_value) == 0.0:
            current_value = 10000.0
        
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

@app.post("/api/investments/update-prices")
async def update_investment_prices(db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    updated_count = 0
    
    for investment in investments:
        try:
            ticker = yf.Ticker(investment.symbol)
            info = ticker.info
            current_price = info.get('regularMarketPrice') or info.get('previousClose')
            
            if current_price:
                # Use the setattr method to properly update the SQLAlchemy attribute
                setattr(investment, 'current_price', float(current_price))
                updated_count += 1
        except Exception as e:
            print(f"Error updating price for {investment.symbol}: {e}")
            continue
    
    db.commit()
    return {"message": f"Updated prices for {updated_count} investments"}

# Savings Goals
@app.get("/api/savings-goals", response_model=List[SavingsGoalResponse])
async def get_savings_goals(db: Session = Depends(get_db)):
    goals = db.query(SavingsGoal).all()
    return goals

@app.post("/api/savings-goals", response_model=SavingsGoalResponse)
async def create_savings_goal(goal: SavingsGoalCreate, db: Session = Depends(get_db)):
    db_goal = SavingsGoal(
        id=generate_id(),
        name=goal.name,
        target_amount=goal.target_amount,
        target_date=goal.target_date,
        category=goal.category,
        color=goal.color
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

if __name__ == "__main__":
    import uvicorn
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)