import { 
  categories,
  incomes,
  expenses,
  investments,
  savingsGoals,
  savingsTransactions,
  investmentSales,
  type Category, 
  type Income, 
  type Expense, 
  type Investment,
  type SavingsGoal,
  type SavingsTransaction,
  type InvestmentSale,
  type InsertCategory,
  type InsertIncome,
  type InsertExpense,
  type InsertInvestment,
  type InsertSavingsGoal,
  type InsertInvestmentSale
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

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
  sellInvestment(id: string, quantitySold: number, salePrice: number): Promise<InvestmentSale | undefined>;
  getInvestmentSales(): Promise<InvestmentSale[]>;
  getTotalProfitLoss(): Promise<number>;

  // Savings Goals
  getSavingsGoals(): Promise<SavingsGoal[]>;
  getSavingsGoalById(id: string): Promise<SavingsGoal | undefined>;
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: string, goal: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: string): Promise<boolean>;
  addToSavingsGoal(id: string, amount: number): Promise<SavingsGoal | undefined>;
  getSavingsTransactionsByMonth(year: number, month: number): Promise<SavingsTransaction[]>;
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
    
    // Create savings transaction
    const today = new Date().toISOString().split('T')[0];
    await db.insert(savingsTransactions).values({
      savingsGoalId: id,
      amount: amount.toString(),
      date: today,
    });
    
    const newCurrentAmount = parseFloat(goal.currentAmount) + amount;
    const [updatedGoal] = await db
      .update(savingsGoals)
      .set({ currentAmount: newCurrentAmount.toString() })
      .where(eq(savingsGoals.id, id))
      .returning();
    return updatedGoal || undefined;
  }

  async getSavingsTransactionsByMonth(year: number, month: number): Promise<SavingsTransaction[]> {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month
      
      return await db.select()
        .from(savingsTransactions)
        .where(
          and(
            gte(savingsTransactions.date, startDate),
            lte(savingsTransactions.date, endDate)
          )
        );
    } catch (error) {
      console.error("Error getting savings transactions by month:", error);
      return [];
    }
  }

  async sellInvestment(id: string, quantitySold: number, salePrice: number): Promise<InvestmentSale | undefined> {
    try {
      // Get investment details
      const investment = await this.getInvestmentById(id);
      if (!investment) return undefined;

      const purchasePrice = parseFloat(investment.purchasePrice);
      const totalSaleValue = quantitySold * salePrice;
      const totalPurchaseValue = quantitySold * purchasePrice;
      const profitLoss = totalSaleValue - totalPurchaseValue;

      // Create sale record
      const today = new Date().toISOString().split('T')[0];
      const [sale] = await db.insert(investmentSales).values({
        investmentId: id,
        investmentSymbol: investment.symbol,
        investmentName: investment.name,
        quantitySold: quantitySold.toFixed(2),
        salePrice: salePrice.toFixed(2),
        totalSaleValue: totalSaleValue.toFixed(2),
        profitLoss: profitLoss.toFixed(2),
        saleDate: today,
      }).returning();

      // Update investment quantity
      const newQuantity = parseFloat(investment.quantity) - quantitySold;
      if (newQuantity <= 0) {
        // Delete investment if fully sold (but keep sale record with reference)
        await db
          .delete(investments)
          .where(eq(investments.id, id));
      } else {
        // Update remaining quantity
        await db
          .update(investments)
          .set({ quantity: newQuantity.toFixed(2) })
          .where(eq(investments.id, id));
      }

      return sale;
    } catch (error) {
      console.error("Error selling investment:", error);
      return undefined;
    }
  }

  async getInvestmentSales(): Promise<InvestmentSale[]> {
    return await db.select().from(investmentSales).orderBy(desc(investmentSales.saleDate));
  }

  async getTotalProfitLoss(): Promise<number> {
    try {
      const sales = await this.getInvestmentSales();
      return sales.reduce((total, sale) => total + parseFloat(sale.profitLoss), 0);
    } catch (error) {
      console.error("Error calculating total profit/loss:", error);
      return 0;
    }
  }
}

export const storage = new DatabaseStorage();