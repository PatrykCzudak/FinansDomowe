from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date, datetime

# Category schemas
class CategoryBase(BaseModel):
    name: str
    color: str = "#3B82F6"
    budget: Decimal

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    budget: Optional[Decimal] = None

class Category(CategoryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Income schemas
class IncomeBase(BaseModel):
    name: str
    amount: Decimal
    frequency: str = "monthly"
    date: date

class IncomeCreate(IncomeBase):
    pass

class IncomeUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[Decimal] = None
    frequency: Optional[str] = None
    date: Optional[date] = None

class Income(IncomeBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Expense schemas
class ExpenseBase(BaseModel):
    description: str
    amount: Decimal
    category_id: str
    date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    category_id: Optional[str] = None
    date: Optional[date] = None

class Expense(ExpenseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Investment schemas
class InvestmentBase(BaseModel):
    symbol: str
    name: str
    type: str
    quantity: Decimal
    purchase_price: Decimal
    purchase_date: date

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentUpdate(BaseModel):
    symbol: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = None
    quantity: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    current_price: Optional[Decimal] = None
    purchase_date: Optional[date] = None

class Investment(InvestmentBase):
    id: str
    current_price: Optional[Decimal] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Savings Goal schemas
class SavingsGoalBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_amount: Decimal
    target_date: date
    color: str = "#10B981"

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[Decimal] = None
    current_amount: Optional[Decimal] = None
    target_date: Optional[date] = None
    color: Optional[str] = None
    is_completed: Optional[bool] = None

class SavingsGoal(SavingsGoalBase):
    id: str
    current_amount: Decimal
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AddSavingsRequest(BaseModel):
    amount: Decimal