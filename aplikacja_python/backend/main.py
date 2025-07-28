from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
import asyncio
from contextlib import asynccontextmanager

from database import get_db, init_db, create_database_if_not_exists
from models import Category, Income, Expense, Investment, SavingsGoal
from schemas import (
    CategoryCreate, CategoryUpdate, Category as CategorySchema,
    IncomeCreate, IncomeUpdate, Income as IncomeSchema,
    ExpenseCreate, ExpenseUpdate, Expense as ExpenseSchema,
    InvestmentCreate, InvestmentUpdate, Investment as InvestmentSchema,
    SavingsGoalCreate, SavingsGoalUpdate, SavingsGoal as SavingsGoalSchema,
    AddSavingsRequest
)
from price_service import price_service
from ai_service import ai_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting FastAPI application...")
    
    # Create database if it doesn't exist
    create_database_if_not_exists()
    
    # Initialize database tables
    init_db()
    
    # Start price update scheduler
    price_service.start_scheduler()
    
    # Update prices on startup
    await price_service.update_investment_prices()
    
    logger.info("Application startup completed")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    price_service.stop_scheduler()

app = FastAPI(
    title="Personal Budget Management API",
    description="Comprehensive financial management with investments and risk analysis",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Categories endpoints
@app.get("/api/categories", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.post("/api/categories", response_model=CategorySchema)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.put("/api/categories/{category_id}", response_model=CategorySchema)
def update_category(category_id: str, category: CategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for field, value in category.dict(exclude_unset=True).items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/categories/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Incomes endpoints
@app.get("/api/incomes", response_model=List[IncomeSchema])
def get_incomes(db: Session = Depends(get_db)):
    return db.query(Income).all()

@app.post("/api/incomes", response_model=IncomeSchema)
def create_income(income: IncomeCreate, db: Session = Depends(get_db)):
    db_income = Income(**income.dict())
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

@app.put("/api/incomes/{income_id}", response_model=IncomeSchema)
def update_income(income_id: str, income: IncomeUpdate, db: Session = Depends(get_db)):
    db_income = db.query(Income).filter(Income.id == income_id).first()
    if not db_income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    for field, value in income.dict(exclude_unset=True).items():
        setattr(db_income, field, value)
    
    db.commit()
    db.refresh(db_income)
    return db_income

@app.delete("/api/incomes/{income_id}")
def delete_income(income_id: str, db: Session = Depends(get_db)):
    db_income = db.query(Income).filter(Income.id == income_id).first()
    if not db_income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    db.delete(db_income)
    db.commit()
    return {"message": "Income deleted successfully"}

# Expenses endpoints
@app.get("/api/expenses", response_model=List[ExpenseSchema])
def get_expenses(
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Expense)
    
    if month and year:
        from sqlalchemy import extract
        query = query.filter(
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        )
    
    return query.all()

@app.post("/api/expenses", response_model=ExpenseSchema)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.put("/api/expenses/{expense_id}", response_model=ExpenseSchema)
def update_expense(expense_id: str, expense: ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    for field, value in expense.dict(exclude_unset=True).items():
        setattr(db_expense, field, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.delete("/api/expenses/{expense_id}")
def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

# Investments endpoints
@app.get("/api/investments", response_model=List[InvestmentSchema])
def get_investments(db: Session = Depends(get_db)):
    return db.query(Investment).all()

@app.post("/api/investments", response_model=InvestmentSchema)
def create_investment(investment: InvestmentCreate, db: Session = Depends(get_db)):
    db_investment = Investment(**investment.dict())
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    
    # Update price immediately
    asyncio.create_task(price_service.update_investment_prices())
    
    return db_investment

@app.put("/api/investments/{investment_id}", response_model=InvestmentSchema)
def update_investment(investment_id: str, investment: InvestmentUpdate, db: Session = Depends(get_db)):
    db_investment = db.query(Investment).filter(Investment.id == investment_id).first()
    if not db_investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    
    for field, value in investment.dict(exclude_unset=True).items():
        setattr(db_investment, field, value)
    
    db.commit()
    db.refresh(db_investment)
    return db_investment

@app.delete("/api/investments/{investment_id}")
def delete_investment(investment_id: str, db: Session = Depends(get_db)):
    db_investment = db.query(Investment).filter(Investment.id == investment_id).first()
    if not db_investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    
    db.delete(db_investment)
    db.commit()
    return {"message": "Investment deleted successfully"}

# Savings Goals endpoints
@app.get("/api/savings-goals", response_model=List[SavingsGoalSchema])
def get_savings_goals(db: Session = Depends(get_db)):
    return db.query(SavingsGoal).all()

@app.post("/api/savings-goals", response_model=SavingsGoalSchema)
def create_savings_goal(goal: SavingsGoalCreate, db: Session = Depends(get_db)):
    db_goal = SavingsGoal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.put("/api/savings-goals/{goal_id}", response_model=SavingsGoalSchema)
def update_savings_goal(goal_id: str, goal: SavingsGoalUpdate, db: Session = Depends(get_db)):
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    
    for field, value in goal.dict(exclude_unset=True).items():
        setattr(db_goal, field, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.delete("/api/savings-goals/{goal_id}")
def delete_savings_goal(goal_id: str, db: Session = Depends(get_db)):
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    
    db.delete(db_goal)
    db.commit()
    return {"message": "Savings goal deleted successfully"}

@app.post("/api/savings-goals/{goal_id}/add", response_model=SavingsGoalSchema)
def add_savings(goal_id: str, request: AddSavingsRequest, db: Session = Depends(get_db)):
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    
    db_goal.current_amount = float(db_goal.current_amount) + float(request.amount)
    
    # Check if goal is completed
    if float(db_goal.current_amount) >= float(db_goal.target_amount):
        db_goal.is_completed = True
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

# Price service endpoints
@app.post("/api/prices/update")
async def update_prices():
    await price_service.update_investment_prices()
    return {"message": "Prices updated successfully"}

@app.get("/api/prices/search")
async def search_symbols(q: str):
    results = await price_service.search_symbols(q)
    return {"results": results}

@app.get("/api/prices/stock/{symbol}")
async def get_stock_info(symbol: str):
    info = await price_service.get_stock_info(symbol)
    if not info:
        raise HTTPException(status_code=404, detail="Stock not found")
    return info

# AI Assistant endpoints
@app.get("/api/ai/portfolio-analysis")
def get_portfolio_analysis(db: Session = Depends(get_db)):
    return ai_service.analyze_portfolio(db)

@app.get("/api/ai/budget-analysis")
def get_budget_analysis(db: Session = Depends(get_db)):
    return ai_service.analyze_budget(db)

@app.post("/api/ai/custom-query")
def custom_ai_query(query: dict, db: Session = Depends(get_db)):
    user_query = query.get("query", "")
    response = ai_service.generate_custom_analysis(user_query, db)
    return {"response": response}

@app.get("/api/ai/risk-analysis")
def get_risk_analysis(db: Session = Depends(get_db)):
    investments = db.query(Investment).all()
    
    if not investments:
        return {
            "var_95": 0,
            "var_99": 0,
            "expected_shortfall_95": 0,
            "expected_shortfall_99": 0,
            "recommendations": ["Brak danych do analizy ryzyka"]
        }
    
    # Calculate simple returns based on investments
    returns = []
    for inv in investments:
        if inv.current_price is not None and inv.purchase_price is not None:
            current = float(inv.current_price) if inv.current_price else 0
            purchase = float(inv.purchase_price) if inv.purchase_price else 1
            if purchase > 0:
                return_rate = (current - purchase) / purchase
                returns.append(return_rate)
    
    if not returns:
        return {
            "var_95": 0,
            "var_99": 0,
            "expected_shortfall_95": 0,
            "expected_shortfall_99": 0,
            "recommendations": ["Brak aktualnych cen do analizy ryzyka"]
        }
    
    var_95 = ai_service.calculate_var(returns, 0.95)
    var_99 = ai_service.calculate_var(returns, 0.99)
    
    return {
        "var_95": var_95["var"],
        "var_99": var_99["var"],
        "expected_shortfall_95": var_95["expected_shortfall"],
        "expected_shortfall_99": var_99["expected_shortfall"],
        "returns_data": returns,
        "recommendations": [
            "Analiza VaR oparta na obecnych pozycjach",
            "Rozważ dywersyfikację dla zmniejszenia ryzyka"
        ]
    }

# Health check
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Personal Budget Management API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)