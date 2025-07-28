import { 
  categories,
  incomes,
  expenses,
  investments,
  savingsGoals,
  type Category, 
  type Income, 
  type Expense, 
  type Investment,
  type SavingsGoal,
  type InsertCategory,
  type InsertIncome,
  type InsertExpense,
  type InsertInvestment,
  type InsertSavingsGoal
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

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

  // Savings Goals
  getSavingsGoals(): Promise<SavingsGoal[]>;
  getSavingsGoalById(id: string): Promise<SavingsGoal | undefined>;
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: string, goal: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: string): Promise<boolean>;
  addToSavingsGoal(id: string, amount: number): Promise<SavingsGoal | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Incomes
  async getIncomes(): Promise<Income[]> {
    return await db.select().from(incomes);
  }

  async getIncomeById(id: string): Promise<Income | undefined> {
    const [income] = await db.select().from(incomes).where(eq(incomes.id, id));
    return income || undefined;
  }

  async createIncome(income: InsertIncome): Promise<Income> {
    const [newIncome] = await db.insert(incomes).values(income).returning();
    return newIncome;
  }

  async updateIncome(id: string, income: Partial<InsertIncome>): Promise<Income | undefined> {
    const [updatedIncome] = await db
      .update(incomes)
      .set(income)
      .where(eq(incomes.id, id))
      .returning();
    return updatedIncome || undefined;
  }

  async deleteIncome(id: string): Promise<boolean> {
    const result = await db.delete(incomes).where(eq(incomes.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses);
  }

  async getExpenseById(id: string): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense || undefined;
  }

  async getExpensesByCategory(categoryId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.categoryId, categoryId));
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(and(gte(expenses.date, startDate), lte(expenses.date, endDate)));
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense | undefined> {
    const [updatedExpense] = await db
      .update(expenses)
      .set(expense)
      .where(eq(expenses.id, id))
      .returning();
    return updatedExpense || undefined;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Investments
  async getInvestments(): Promise<Investment[]> {
    return await db.select().from(investments);
  }

  async getInvestmentById(id: string): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment || undefined;
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  async updateInvestment(id: string, investment: Partial<InsertInvestment>): Promise<Investment | undefined> {
    const [updatedInvestment] = await db
      .update(investments)
      .set(investment)
      .where(eq(investments.id, id))
      .returning();
    return updatedInvestment || undefined;
  }

  async deleteInvestment(id: string): Promise<boolean> {
    const result = await db.delete(investments).where(eq(investments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Savings Goals
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    return await db.select().from(savingsGoals).where(eq(savingsGoals.isActive, true));
  }

  async getSavingsGoalById(id: string): Promise<SavingsGoal | undefined> {
    const [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.id, id));
    return goal || undefined;
  }

  async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const [newGoal] = await db.insert(savingsGoals).values(goal).returning();
    return newGoal;
  }

  async updateSavingsGoal(id: string, goal: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined> {
    const [updatedGoal] = await db
      .update(savingsGoals)
      .set(goal)
      .where(eq(savingsGoals.id, id))
      .returning();
    return updatedGoal || undefined;
  }

  async deleteSavingsGoal(id: string): Promise<boolean> {
    const result = await db.delete(savingsGoals).where(eq(savingsGoals.id, id));
    return (result.rowCount || 0) > 0;
  }

  async addToSavingsGoal(id: string, amount: number): Promise<SavingsGoal | undefined> {
    const goal = await this.getSavingsGoalById(id);
    if (!goal) return undefined;
    
    const newCurrentAmount = parseFloat(goal.currentAmount) + amount;
    const [updatedGoal] = await db
      .update(savingsGoals)
      .set({ currentAmount: newCurrentAmount.toString() })
      .where(eq(savingsGoals.id, id))
      .returning();
    return updatedGoal || undefined;
  }
}

export const storage = new DatabaseStorage();