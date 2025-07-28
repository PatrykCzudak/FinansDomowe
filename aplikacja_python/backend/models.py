from sqlalchemy import Column, String, Numeric, Date, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(Text, nullable=False)
    color = Column(Text, nullable=False, default="#3B82F6")
    budget = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    expenses = relationship("Expense", back_populates="category")

class Income(Base):
    __tablename__ = "incomes"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(Text, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    frequency = Column(Text, nullable=False, default="monthly")
    date = Column(Date, nullable=False, default=func.current_date())
    created_at = Column(DateTime, default=func.now())

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    description = Column(Text, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    category = relationship("Category", back_populates="expenses")

class Investment(Base):
    __tablename__ = "investments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    type = Column(Text, nullable=False)
    quantity = Column(Numeric(15, 8), nullable=False)
    purchase_price = Column(Numeric(10, 2), nullable=False)
    current_price = Column(Numeric(10, 2))
    purchase_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=func.now())

class SavingsGoal(Base):
    __tablename__ = "savings_goals"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(Text, nullable=False)
    description = Column(Text)
    target_amount = Column(Numeric(10, 2), nullable=False)
    current_amount = Column(Numeric(10, 2), nullable=False, default=0)
    target_date = Column(Date, nullable=False)
    color = Column(Text, nullable=False, default="#10B981")
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())