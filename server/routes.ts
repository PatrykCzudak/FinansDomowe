import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertIncomeSchema, insertExpenseSchema, insertInvestmentSchema, insertSavingsGoalSchema } from "@shared/schema";
import { priceService } from "./services/price-service";
import { aiAssistant } from "./services/ai-assistant";
import { z } from "zod";
import yahooFinance from 'yahoo-finance2';
import { subDays, format } from 'date-fns';

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, data);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Incomes routes
  app.get("/api/incomes", async (req, res) => {
    try {
      const incomes = await storage.getIncomes();
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incomes" });
    }
  });

  app.post("/api/incomes", async (req, res) => {
    try {
      const data = insertIncomeSchema.parse(req.body);
      const income = await storage.createIncome(data);
      res.status(201).json(income);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid income data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to create income" });
      }
    }
  });

  app.put("/api/incomes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertIncomeSchema.partial().parse(req.body);
      const income = await storage.updateIncome(id, data);
      if (!income) {
        res.status(404).json({ message: "Income not found" });
        return;
      }
      res.json(income);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid income data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to update income" });
      }
    }
  });

  app.delete("/api/incomes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteIncome(id);
      if (!deleted) {
        res.status(404).json({ message: "Income not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete income" });
    }
  });

  // Expenses routes
  app.get("/api/expenses", async (req, res) => {
    try {
      const { categoryId, startDate, endDate } = req.query;
      
      let expenses;
      if (categoryId) {
        expenses = await storage.getExpensesByCategory(categoryId as string);
      } else if (startDate && endDate) {
        expenses = await storage.getExpensesByDateRange(startDate as string, endDate as string);
      } else {
        expenses = await storage.getExpenses();
      }
      
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(data);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid expense data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to create expense" });
      }
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, data);
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
        return;
      }
      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid expense data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to update expense" });
      }
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteExpense(id);
      if (!deleted) {
        res.status(404).json({ message: "Expense not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Investments routes
  app.get("/api/investments", async (req, res) => {
    try {
      const investments = await storage.getInvestments();
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  app.post("/api/investments", async (req, res) => {
    try {
      const data = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(data);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid investment data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to create investment" });
      }
    }
  });

  app.put("/api/investments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertInvestmentSchema.partial().parse(req.body);
      const investment = await storage.updateInvestment(id, data);
      if (!investment) {
        res.status(404).json({ message: "Investment not found" });
        return;
      }
      res.json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid investment data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to update investment" });
      }
    }
  });

  app.delete("/api/investments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteInvestment(id);
      if (!deleted) {
        res.status(404).json({ message: "Investment not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete investment" });
    }
  });

  app.post("/api/investments/:id/sell", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantitySold, salePrice } = req.body;

      if (!quantitySold || !salePrice || quantitySold <= 0 || salePrice <= 0) {
        res.status(400).json({ message: "Invalid quantity or sale price" });
        return;
      }

      const sale = await storage.sellInvestment(id, parseFloat(quantitySold), parseFloat(salePrice));
      if (!sale) {
        res.status(404).json({ message: "Investment not found" });
        return;
      }

      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ message: "Failed to sell investment" });
    }
  });

  app.get("/api/investment-sales", async (req, res) => {
    try {
      const sales = await storage.getInvestmentSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment sales" });
    }
  });

  app.get("/api/portfolio/profit-loss", async (req, res) => {
    try {
      const totalProfitLoss = await storage.getTotalProfitLoss();
      res.json({ totalProfitLoss });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate profit/loss" });
    }
  });

  // Savings Goals routes
  app.get("/api/savings-goals", async (req, res) => {
    try {
      const goals = await storage.getSavingsGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch savings goals" });
    }
  });

  app.post("/api/savings-goals", async (req, res) => {
    try {
      const data = insertSavingsGoalSchema.parse(req.body);
      const goal = await storage.createSavingsGoal(data);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid savings goal data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to create savings goal" });
      }
    }
  });

  app.put("/api/savings-goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertSavingsGoalSchema.partial().parse(req.body);
      const goal = await storage.updateSavingsGoal(id, data);
      if (!goal) {
        res.status(404).json({ message: "Savings goal not found" });
        return;
      }
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid savings goal data", errors: error.issues });
      } else {
        res.status(500).json({ message: "Failed to update savings goal" });
      }
    }
  });

  app.delete("/api/savings-goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSavingsGoal(id);
      if (!deleted) {
        res.status(404).json({ message: "Savings goal not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete savings goal" });
    }
  });

  app.post("/api/savings-goals/:id/add-savings", async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const goal = await storage.addToSavingsGoal(id, parseFloat(amount));
      if (!goal) {
        res.status(404).json({ message: "Savings goal not found" });
        return;
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to add savings" });
    }
  });

  app.get("/api/savings-transactions/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      const transactions = await storage.getSavingsTransactionsByMonth(
        parseInt(year),
        parseInt(month)
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch savings transactions" });
    }
  });

  // Price service routes
  app.get("/api/prices/update", async (req, res) => {
    try {
      await priceService.updateAllPrices();
      res.json({ message: "Ceny zostały zaktualizowane" });
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas aktualizacji cen" });
    }
  });

  app.get("/api/prices/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const price = await priceService.getPrice(symbol);
      if (price === null) {
        res.status(404).json({ message: "Nie znaleziono ceny dla symbolu" });
        return;
      }
      res.json({ symbol, price });
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas pobierania ceny" });
    }
  });

  app.get("/api/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const results = await priceService.searchSymbol(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas wyszukiwania" });
    }
  });

  app.get("/api/historical/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '1y' } = req.query;
      const data = await priceService.getHistoricalData(symbol, period as string);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas pobierania danych historycznych" });
    }
  });

  // AI Assistant routes
  app.get("/api/ai/analyze/portfolio", async (req, res) => {
    try {
      const analysis = await aiAssistant.analyzePortfolio();
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas analizy portfolio" });
    }
  });

  app.get("/api/ai/analyze/budget", async (req, res) => {
    try {
      const analysis = await aiAssistant.analyzeBudget();
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas analizy budżetu" });
    }
  });

  app.get("/api/ai/recommendations", async (req, res) => {
    try {
      const recommendations = await aiAssistant.generateRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas generowania rekomendacji" });
    }
  });

  app.post("/api/ai/query", async (req, res) => {
    try {
      const query = req.body;
      const result = await aiAssistant.processQuery(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Błąd podczas przetwarzania zapytania AI" });
    }
  });

  // Portfolio historical data for risk analysis
  app.get("/api/portfolio/historical/:days", async (req, res) => {
    try {
      const days = parseInt(req.params.days) || 252;
      const investments = await storage.getInvestments();
      
      if (investments.length === 0) {
        res.json([]);
        return;
      }

      // Calculate portfolio weights
      const totalValue = investments.reduce((sum, inv) => 
        sum + (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)), 0);
      
      const portfolioWeights = investments.map(inv => ({
        symbol: inv.symbol,
        weight: (parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity)) / totalValue,
        quantity: parseFloat(inv.quantity)
      }));

      // Fetch historical data for each symbol
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      
      const historicalDataPromises = portfolioWeights.map(async (weight) => {
        try {
          const historical = await yahooFinance.historical(weight.symbol, {
            period1: startDate,
            period2: endDate,
            interval: '1d'
          });
          
          return {
            symbol: weight.symbol,
            weight: weight.weight,
            data: historical.map(h => ({
              date: h.date,
              close: h.close,
              volume: h.volume
            }))
          };
        } catch (error) {
          console.error(`Error fetching data for ${weight.symbol}:`, error);
          return { symbol: weight.symbol, weight: weight.weight, data: [] };
        }
      });

      const allHistoricalData = await Promise.all(historicalDataPromises);
      
      // Calculate portfolio daily values and returns
      const dates = allHistoricalData[0]?.data?.map(d => d.date) || [];
      const portfolioTimeSeries = dates.map(date => {
        let portfolioValue = 0;
        let validData = true;
        
        for (const stock of allHistoricalData) {
          const dayData = stock.data.find(d => d.date.getTime() === date.getTime());
          if (dayData && stock.weight > 0) {
            portfolioValue += dayData.close * stock.weight * totalValue;
          } else {
            validData = false;
            break;
          }
        }
        
        return validData ? { date: date.toISOString(), portfolioValue } : null;
      }).filter(Boolean);

      // Calculate returns
      const timeSeriesWithReturns = portfolioTimeSeries.map((point, index) => {
        if (!point || index === 0) {
          return point ? {
            ...point,
            returns: 0,
            cumulativeReturns: 0
          } : null;
        }
        
        const previousPoint = portfolioTimeSeries[index - 1];
        if (!previousPoint) return null;
        
        const returns = (point.portfolioValue - previousPoint.portfolioValue) / previousPoint.portfolioValue;
        const firstPoint = portfolioTimeSeries[0];
        const cumulativeReturns = firstPoint ? (point.portfolioValue - firstPoint.portfolioValue) / firstPoint.portfolioValue : 0;
        
        return {
          ...point,
          returns,
          cumulativeReturns
        };
      }).filter(Boolean);

      res.json(timeSeriesWithReturns);
    } catch (error) {
      console.error('Error fetching portfolio historical data:', error);
      res.status(500).json({ message: "Failed to fetch historical data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
