import numpy as np
import pandas as pd
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import Investment, Category, Expense, Income, SavingsGoal
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class AIAssistantService:
    def __init__(self):
        pass
    
    def analyze_portfolio(self, db: Session) -> Dict[str, Any]:
        """Analyze investment portfolio"""
        try:
            investments = db.query(Investment).all()
            
            if not investments:
                return {
                    "total_value": 0,
                    "total_invested": 0,
                    "profit_loss": 0,
                    "profit_loss_percentage": 0,
                    "recommendations": ["Brak inwestycji w portfelu. Rozważ dywersyfikację."]
                }
            
            total_invested = sum(float(inv.quantity) * float(inv.purchase_price) for inv in investments)
            total_current = sum(
                float(inv.quantity) * float(inv.current_price or inv.purchase_price) 
                for inv in investments
            )
            
            profit_loss = total_current - total_invested
            profit_loss_percentage = (profit_loss / total_invested * 100) if total_invested > 0 else 0
            
            # Generate recommendations
            recommendations = []
            
            if len(investments) < 3:
                recommendations.append("Rozważ zwiększenie dywersyfikacji portfela.")
            
            if profit_loss_percentage < -10:
                recommendations.append("Portfel ma znaczące straty. Przeanalizuj pozycje.")
            elif profit_loss_percentage > 20:
                recommendations.append("Portfel osiąga dobre wyniki. Rozważ realizację zysków.")
            
            # Analyze allocation
            allocation = {}
            for inv in investments:
                inv_type = inv.type
                value = float(inv.quantity) * float(inv.current_price or inv.purchase_price)
                allocation[inv_type] = allocation.get(inv_type, 0) + value
            
            if len(allocation) == 1:
                recommendations.append("Rozważ dywersyfikację między różne klasy aktywów.")
            
            return {
                "total_value": total_current,
                "total_invested": total_invested,
                "profit_loss": profit_loss,
                "profit_loss_percentage": profit_loss_percentage,
                "allocation": allocation,
                "recommendations": recommendations
            }
            
        except Exception as e:
            logger.error(f"Portfolio analysis failed: {e}")
            return {"error": "Analiza portfela nie powiodła się"}
    
    def analyze_budget(self, db: Session) -> Dict[str, Any]:
        """Analyze budget and spending patterns"""
        try:
            categories = db.query(Category).all()
            expenses = db.query(Expense).all()
            incomes = db.query(Income).all()
            
            total_budget = sum(float(cat.budget) for cat in categories)
            total_spent = sum(float(exp.amount) for exp in expenses)
            total_income = sum(float(inc.amount) for inc in incomes)
            
            # Category analysis
            category_analysis = {}
            for category in categories:
                cat_expenses = [exp for exp in expenses if exp.category_id == category.id]
                cat_spent = sum(float(exp.amount) for exp in cat_expenses)
                budget_usage = (cat_spent / float(category.budget) * 100) if category.budget > 0 else 0
                
                category_analysis[category.name] = {
                    "budget": float(category.budget),
                    "spent": cat_spent,
                    "usage_percentage": budget_usage,
                    "remaining": float(category.budget) - cat_spent
                }
            
            # Generate recommendations
            recommendations = []
            
            if total_spent > total_budget:
                recommendations.append("Wydatki przekraczają budżet. Przeanalizuj kategorie.")
            
            for cat_name, analysis in category_analysis.items():
                if analysis["usage_percentage"] > 90:
                    recommendations.append(f"Kategoria '{cat_name}' bliska wyczerpania budżetu.")
                elif analysis["usage_percentage"] > 100:
                    recommendations.append(f"Kategoria '{cat_name}' przekroczyła budżet.")
            
            if total_income > total_spent:
                savings_potential = total_income - total_spent
                recommendations.append(f"Możliwość oszczędzania: {savings_potential:.2f} PLN")
            
            return {
                "total_budget": total_budget,
                "total_spent": total_spent,
                "total_income": total_income,
                "budget_usage_percentage": (total_spent / total_budget * 100) if total_budget > 0 else 0,
                "category_analysis": category_analysis,
                "recommendations": recommendations
            }
            
        except Exception as e:
            logger.error(f"Budget analysis failed: {e}")
            return {"error": "Analiza budżetu nie powiodła się"}
    
    def calculate_var(self, returns: List[float], confidence_level: float = 0.95) -> Dict[str, float]:
        """Calculate Value at Risk"""
        try:
            if not returns:
                return {"var": 0, "expected_shortfall": 0}
            
            returns_array = np.array(returns)
            
            # Calculate VaR
            var = np.percentile(returns_array, (1 - confidence_level) * 100)
            
            # Calculate Expected Shortfall (Conditional VaR)
            tail_losses = returns_array[returns_array <= var]
            expected_shortfall = np.mean(tail_losses) if len(tail_losses) > 0 else var
            
            return {
                "var": float(var),
                "expected_shortfall": float(expected_shortfall),
                "confidence_level": confidence_level
            }
            
        except Exception as e:
            logger.error(f"VaR calculation failed: {e}")
            return {"var": 0, "expected_shortfall": 0}
    
    def generate_custom_analysis(self, query: str, db: Session) -> str:
        """Generate custom analysis based on user query"""
        try:
            # Simple keyword-based analysis
            query_lower = query.lower()
            
            if "portfel" in query_lower or "inwestycj" in query_lower:
                portfolio_data = self.analyze_portfolio(db)
                return f"Analiza portfela: Wartość: {portfolio_data.get('total_value', 0):.2f} PLN, P&L: {portfolio_data.get('profit_loss_percentage', 0):.2f}%"
            
            elif "budżet" in query_lower or "wydatk" in query_lower:
                budget_data = self.analyze_budget(db)
                return f"Analiza budżetu: Wykorzystanie: {budget_data.get('budget_usage_percentage', 0):.2f}%"
            
            elif "oszczędności" in query_lower:
                savings = db.query(SavingsGoal).all()
                total_saved = sum(float(s.current_amount) for s in savings)
                return f"Łączne oszczędności: {total_saved:.2f} PLN w {len(savings)} celach"
            
            else:
                return "Mogę analizować portfel inwestycyjny, budżet i oszczędności. Zadaj konkretne pytanie."
                
        except Exception as e:
            logger.error(f"Custom analysis failed: {e}")
            return "Wystąpił błąd podczas analizy."

# Global AI service instance
ai_service = AIAssistantService()