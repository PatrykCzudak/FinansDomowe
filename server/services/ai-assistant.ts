import { storage } from '../storage';
import { priceService } from './price-service';
import type { Investment, Category, Expense, Income } from '@shared/schema';

interface AnalysisResult {
  type: 'portfolio' | 'budget' | 'risk' | 'recommendation';
  title: string;
  content: string;
  data?: any;
  confidence: number;
}

interface AIQuery {
  type: 'analyze' | 'recommend' | 'predict' | 'optimize';
  context: string;
  data?: any;
}

class AIAssistant {
  constructor() {
    console.log('AI Assistant inicjalizowany - tryb rozwojowy');
  }

  async analyzePortfolio(): Promise<AnalysisResult> {
    const investments = await storage.getInvestments();
    
    if (investments.length === 0) {
      return {
        type: 'portfolio',
        title: 'Portfolio jest puste',
        content: 'Nie masz jeszcze żadnych inwestycji. Rozważ dodanie pierwszych instrumentów finansowych do swojego portfolio.',
        confidence: 1.0
      };
    }

    // Analiza dywersyfikacji
    const typeDistribution = this.calculateTypeDistribution(investments);
    const totalValue = investments.reduce((sum, inv) => {
      const currentPrice = parseFloat(inv.currentPrice || inv.purchasePrice);
      return sum + (currentPrice * parseFloat(inv.quantity));
    }, 0);

    const analysis = this.generatePortfolioAnalysis(typeDistribution, totalValue, investments);
    
    return {
      type: 'portfolio',
      title: 'Analiza Portfolio',
      content: analysis,
      data: { typeDistribution, totalValue },
      confidence: 0.8
    };
  }

  async analyzeBudget(): Promise<AnalysisResult> {
    const [categories, expenses, incomes] = await Promise.all([
      storage.getCategories(),
      storage.getExpenses(),
      storage.getIncomes()
    ]);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentMonth));
    
    const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const totalBudget = categories.reduce((sum, cat) => sum + parseFloat(cat.budget), 0);

    const analysis = this.generateBudgetAnalysis(totalIncome, totalSpent, totalBudget, categories, monthlyExpenses);

    return {
      type: 'budget',
      title: 'Analiza Budżetu',
      content: analysis,
      data: { totalIncome, totalSpent, totalBudget },
      confidence: 0.9
    };
  }

  async generateRecommendations(): Promise<AnalysisResult[]> {
    const recommendations: AnalysisResult[] = [];

    // Rekomendacje inwestycyjne
    const portfolioRec = await this.getInvestmentRecommendations();
    if (portfolioRec) recommendations.push(portfolioRec);

    // Rekomendacje budżetowe
    const budgetRec = await this.getBudgetRecommendations();
    if (budgetRec) recommendations.push(budgetRec);

    return recommendations;
  }

  async processQuery(query: AIQuery): Promise<AnalysisResult> {
    switch (query.type) {
      case 'analyze':
        return query.context.includes('portfolio') 
          ? await this.analyzePortfolio()
          : await this.analyzeBudget();
      
      case 'recommend':
        const recommendations = await this.generateRecommendations();
        return {
          type: 'recommendation',
          title: 'Rekomendacje AI',
          content: this.formatRecommendations(recommendations),
          data: recommendations,
          confidence: 0.7
        };

      case 'predict':
        return this.generatePredictions();

      case 'optimize':
        return this.generateOptimizations();

      default:
        return {
          type: 'recommendation',
          title: 'Nieznane zapytanie',
          content: 'Nie rozumiem tego zapytania. Spróbuj zapytać o analizę portfolio lub budżetu.',
          confidence: 0.1
        };
    }
  }

  private calculateTypeDistribution(investments: Investment[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    investments.forEach(inv => {
      const value = parseFloat(inv.currentPrice || inv.purchasePrice) * parseFloat(inv.quantity);
      distribution[inv.type] = (distribution[inv.type] || 0) + value;
    });

    return distribution;
  }

  private generatePortfolioAnalysis(typeDistribution: Record<string, number>, totalValue: number, investments: Investment[]): string {
    const types = Object.keys(typeDistribution);
    const dominantType = types.reduce((a, b) => typeDistribution[a] > typeDistribution[b] ? a : b);
    const dominantPercentage = ((typeDistribution[dominantType] / totalValue) * 100).toFixed(1);

    let analysis = `Twoje portfolio ma wartość ${totalValue.toFixed(2)} zł i składa się z ${investments.length} instrumentów finansowych.\n\n`;
    
    analysis += `**Dywersyfikacja:**\n`;
    analysis += `- Dominujący typ: ${dominantType} (${dominantPercentage}%)\n`;
    
    if (parseFloat(dominantPercentage) > 70) {
      analysis += `- ⚠️ Portfolio jest słabo zdywersyfikowane. Rozważ dodanie innych typów inwestycji.\n`;
    } else if (parseFloat(dominantPercentage) < 40) {
      analysis += `- ✅ Portfolio jest dobrze zdywersyfikowane.\n`;
    }

    // Analiza zysków/strat
    const totalPurchaseValue = investments.reduce((sum, inv) => {
      return sum + (parseFloat(inv.purchasePrice) * parseFloat(inv.quantity));
    }, 0);
    
    const totalReturn = ((totalValue - totalPurchaseValue) / totalPurchaseValue) * 100;
    
    analysis += `\n**Wydajność:**\n`;
    analysis += `- Całkowity zwrot: ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%\n`;
    
    if (totalReturn > 10) {
      analysis += `- 🎉 Świetne wyniki! Portfolio radzi sobie bardzo dobrze.\n`;
    } else if (totalReturn > 0) {
      analysis += `- 📈 Portfolio generuje pozytywne zwroty.\n`;
    } else {
      analysis += `- 📉 Portfolio obecnie jest na minusie. Rozważ strategię długoterminową.\n`;
    }

    return analysis;
  }

  private generateBudgetAnalysis(totalIncome: number, totalSpent: number, totalBudget: number, categories: Category[], expenses: Expense[]): string {
    const savingsRate = ((totalIncome - totalSpent) / totalIncome) * 100;
    const budgetUtilization = (totalSpent / totalBudget) * 100;

    let analysis = `**Podsumowanie miesięczne:**\n`;
    analysis += `- Przychody: ${totalIncome.toFixed(2)} zł\n`;
    analysis += `- Wydatki: ${totalSpent.toFixed(2)} zł\n`;
    analysis += `- Stopa oszczędności: ${savingsRate.toFixed(1)}%\n\n`;

    if (savingsRate > 20) {
      analysis += `✅ Doskonała stopa oszczędności! Kontynuuj tę strategię.\n`;
    } else if (savingsRate > 10) {
      analysis += `📊 Dobra stopa oszczędności, ale można poprawić.\n`;
    } else if (savingsRate > 0) {
      analysis += `⚠️ Niska stopa oszczędności. Rozważ redukcję wydatków.\n`;
    } else {
      analysis += `🚨 Wydajesz więcej niż zarabiasz! Pilnie przeanalizuj budżet.\n`;
    }

    analysis += `\n**Wykorzystanie budżetu: ${budgetUtilization.toFixed(1)}%**\n`;

    // Analiza kategorii
    const categoryAnalysis = categories.map(cat => {
      const spent = expenses
        .filter(exp => exp.categoryId === cat.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const utilization = (spent / parseFloat(cat.budget)) * 100;
      
      return { name: cat.name, spent, budget: parseFloat(cat.budget), utilization };
    }).sort((a, b) => b.utilization - a.utilization);

    analysis += `\nNajwyższe wykorzystanie budżetu:\n`;
    categoryAnalysis.slice(0, 3).forEach(cat => {
      analysis += `- ${cat.name}: ${cat.utilization.toFixed(1)}% (${cat.spent.toFixed(2)}/${cat.budget.toFixed(2)} zł)\n`;
    });

    return analysis;
  }

  private async getInvestmentRecommendations(): Promise<AnalysisResult | null> {
    const investments = await storage.getInvestments();
    
    if (investments.length === 0) {
      return {
        type: 'recommendation',
        title: 'Rekomendacje Inwestycyjne',
        content: `**Rozpocznij inwestowanie:**\n- Rozważ ETF-y jako bezpieczny start\n- Zdywersyfikuj portfolio między różne klasy aktywów\n- Zacznij od małych kwot i stopniowo zwiększaj inwestycje`,
        confidence: 0.8
      };
    }

    const typeDistribution = this.calculateTypeDistribution(investments);
    const types = Object.keys(typeDistribution);
    
    let recommendations = `**Rekomendacje dla Twojego Portfolio:**\n`;
    
    if (types.length < 3) {
      recommendations += `- Zwiększ dywersyfikację - dodaj więcej typów inwestycji\n`;
    }
    
    if (!types.includes('etf')) {
      recommendations += `- Rozważ dodanie ETF-ów dla stabilności\n`;
    }
    
    recommendations += `- Regularnie rebalansuj portfolio\n`;
    recommendations += `- Monitoruj koszty transakcji\n`;

    return {
      type: 'recommendation',
      title: 'Rekomendacje Inwestycyjne',
      content: recommendations,
      confidence: 0.7
    };
  }

  private async getBudgetRecommendations(): Promise<AnalysisResult | null> {
    const [expenses, categories, incomes] = await Promise.all([
      storage.getExpenses(),
      storage.getCategories(),
      storage.getIncomes()
    ]);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(currentMonth));
    
    let recommendations = `**Rekomendacje Budżetowe:**\n`;

    // Analiza największych wydatków
    const categorySpending = categories.map(cat => {
      const spent = monthlyExpenses
        .filter(exp => exp.categoryId === cat.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      return { name: cat.name, spent, budget: parseFloat(cat.budget) };
    }).sort((a, b) => b.spent - a.spent);

    const topSpending = categorySpending[0];
    if (topSpending && topSpending.spent > topSpending.budget * 0.8) {
      recommendations += `- Kategoria "${topSpending.name}" przekracza 80% budżetu\n`;
    }

    recommendations += `- Przeanalizuj wydatki w kategorii "${topSpending?.name || 'największej'}"\n`;
    recommendations += `- Ustal cele oszczędnościowe na następny miesiąc\n`;
    recommendations += `- Rozważ automatyczne przenoszenie części dochodów na oszczędności\n`;

    return {
      type: 'recommendation',
      title: 'Rekomendacje Budżetowe',
      content: recommendations,
      confidence: 0.8
    };
  }

  private generatePredictions(): AnalysisResult {
    return {
      type: 'recommendation',
      title: 'Predykcje AI',
      content: `**Przewidywania na następny miesiąc:**\n- Funkcja predykcji zostanie dodana w przyszłej wersji\n- Będzie analizować trendy wydatków i dochodów\n- Pomoże planować przyszłe budżety`,
      confidence: 0.5
    };
  }

  private generateOptimizations(): AnalysisResult {
    return {
      type: 'recommendation',
      title: 'Optymalizacje',
      content: `**Sugestie Optymalizacji:**\n- Funkcja optymalizacji zostanie dodana w przyszłej wersji\n- Będzie sugerować najlepsze alokacje budżetu\n- Pomoże w maksymalizacji oszczędności`,
      confidence: 0.5
    };
  }

  private formatRecommendations(recommendations: AnalysisResult[]): string {
    return recommendations.map(rec => `**${rec.title}**\n${rec.content}`).join('\n\n');
  }
}

export const aiAssistant = new AIAssistant();