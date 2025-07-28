import { 
  type Category, 
  type Income, 
  type Expense, 
  type Investment,
  type InsertCategory,
  type InsertIncome,
  type InsertExpense,
  type InsertInvestment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Incomes
  getIncomes(): Promise<Income[]>;
  getIncomeById(id: string): Promise<Income | undefined>;
  createIncome(income: InsertIncome): Promise<Income>;
  updateIncome(id: string, income: Partial<InsertIncome>): Promise<Income | undefined>;
  deleteIncome(id: string): Promise<boolean>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpenseById(id: string): Promise<Expense | undefined>;
  getExpensesByCategory(categoryId: string): Promise<Expense[]>;
  getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string): Promise<boolean>;

  // Investments
  getInvestments(): Promise<Investment[]>;
  getInvestmentById(id: string): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: string, investment: Partial<InsertInvestment>): Promise<Investment | undefined>;
  deleteInvestment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private incomes: Map<string, Income>;
  private expenses: Map<string, Expense>;
  private investments: Map<string, Investment>;

  constructor() {
    this.categories = new Map();
    this.incomes = new Map();
    this.expenses = new Map();
    this.investments = new Map();

    // Initialize with some default categories
    this.initializeDefaults();
  }

  private initializeDefaults() {
    const defaultCategories = [
      { name: "Żywność", color: "#3B82F6", budget: "1500.00" },
      { name: "Transport", color: "#10B981", budget: "800.00" },
      { name: "Rozrywka", color: "#8B5CF6", budget: "600.00" },
      { name: "Rachunki", color: "#F59E0B", budget: "1200.00" },
      { name: "Zdrowie", color: "#EF4444", budget: "400.00" },
    ];

    const defaultIncomes = [
      { name: "Wynagrodzenie", amount: "5500.00", frequency: "monthly" },
      { name: "Freelancing", amount: "1200.00", frequency: "monthly" },
    ];

    defaultCategories.forEach(cat => {
      const id = randomUUID();
      const category: Category = {
        id,
        name: cat.name,
        color: cat.color,
        budget: cat.budget,
        createdAt: new Date(),
      };
      this.categories.set(id, category);
    });

    defaultIncomes.forEach(inc => {
      const id = randomUUID();
      const income: Income = {
        id,
        name: inc.name,
        amount: inc.amount,
        frequency: inc.frequency,
        createdAt: new Date(),
      };
      this.incomes.set(id, income);
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      id,
      ...insertCategory,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updated: Category = { ...category, ...updateData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Incomes
  async getIncomes(): Promise<Income[]> {
    return Array.from(this.incomes.values());
  }

  async getIncomeById(id: string): Promise<Income | undefined> {
    return this.incomes.get(id);
  }

  async createIncome(insertIncome: InsertIncome): Promise<Income> {
    const id = randomUUID();
    const income: Income = {
      id,
      ...insertIncome,
      createdAt: new Date(),
    };
    this.incomes.set(id, income);
    return income;
  }

  async updateIncome(id: string, updateData: Partial<InsertIncome>): Promise<Income | undefined> {
    const income = this.incomes.get(id);
    if (!income) return undefined;

    const updated: Income = { ...income, ...updateData };
    this.incomes.set(id, updated);
    return updated;
  }

  async deleteIncome(id: string): Promise<boolean> {
    return this.incomes.delete(id);
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpenseById(id: string): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async getExpensesByCategory(categoryId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => expense.categoryId === categoryId);
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    );
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      id,
      ...insertExpense,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: string, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    const updated: Expense = { ...expense, ...updateData };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: string): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Investments
  async getInvestments(): Promise<Investment[]> {
    return Array.from(this.investments.values());
  }

  async getInvestmentById(id: string): Promise<Investment | undefined> {
    return this.investments.get(id);
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = randomUUID();
    const investment: Investment = {
      id,
      ...insertInvestment,
      currentPrice: insertInvestment.purchasePrice, // Initial current price equals purchase price
      createdAt: new Date(),
    };
    this.investments.set(id, investment);
    return investment;
  }

  async updateInvestment(id: string, updateData: Partial<InsertInvestment>): Promise<Investment | undefined> {
    const investment = this.investments.get(id);
    if (!investment) return undefined;

    const updated: Investment = { ...investment, ...updateData };
    this.investments.set(id, updated);
    return updated;
  }

  async deleteInvestment(id: string): Promise<boolean> {
    return this.investments.delete(id);
  }
}

export const storage = new MemStorage();
