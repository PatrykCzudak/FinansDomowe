import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  color: text("color").notNull().default("#3B82F6"),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incomes = pgTable("incomes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  frequency: text("frequency").notNull().default("monthly"),
  date: date("date").notNull().default(sql`CURRENT_DATE`), // Date when the income was received or is expected
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  quantity: decimal("quantity", { precision: 15, scale: 8 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  purchaseDate: date("purchase_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertIncomeSchema = createInsertSchema(incomes).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
  currentPrice: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export const savingsGoals = pgTable("savings_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  targetDate: date("target_date"),
  category: text("category").notNull(),
  color: text("color").notNull().default("#3B82F6"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savingsTransactions = pgTable("savings_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  savingsGoalId: varchar("savings_goal_id").references(() => savingsGoals.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const investmentSales = pgTable("investment_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  investmentId: varchar("investment_id").notNull(), // Remove foreign key constraint
  investmentSymbol: varchar("investment_symbol").notNull(), // Store symbol for reference
  investmentName: varchar("investment_name").notNull(), // Store name for reference
  quantitySold: decimal("quantity_sold", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  totalSaleValue: decimal("total_sale_value", { precision: 10, scale: 2 }).notNull(),
  profitLoss: decimal("profit_loss", { precision: 10, scale: 2 }).notNull(),
  saleDate: date("sale_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).omit({
  id: true,
  createdAt: true,
  currentAmount: true,
}).extend({
  targetDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;

export type Category = typeof categories.$inferSelect;
export type Income = typeof incomes.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Investment = typeof investments.$inferSelect;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type SavingsTransaction = typeof savingsTransactions.$inferSelect;
export type InsertSavingsTransaction = typeof savingsTransactions.$inferInsert;
export type InvestmentSale = typeof investmentSales.$inferSelect;
export type InsertInvestmentSale = typeof investmentSales.$inferInsert;

export const insertSavingsTransactionSchema = createInsertSchema(savingsTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertInvestmentSaleSchema = createInsertSchema(investmentSales).omit({
  id: true,
  createdAt: true,
});
