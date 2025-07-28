// Shared schema types for frontend
export interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
}

export interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category_id: string;
  date: string;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price?: number;
  purchase_date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  color: string;
}

// Insert types (for forms)
export interface InsertCategory {
  name: string;
  color: string;
  budget: number;
}

export interface InsertIncome {
  name: string;
  amount: number;
  frequency: string;
}

export interface InsertExpense {
  description: string;
  amount: number;
  category_id: string;
  date: string;
}

export interface InsertInvestment {
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}

export interface InsertSavingsGoal {
  name: string;
  target_amount: number;
  target_date: string;
  category: string;
  color: string;
}

// Risk analysis types
export interface RiskMetrics {
  var95: number;
  var99: number;
  expectedShortfall95: number;
  expectedShortfall99: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  beta: number;
}

export interface PortfolioHistory {
  date: string;
  portfolioValue: number;
  returns?: number;
  cumulativeReturns?: number;
}