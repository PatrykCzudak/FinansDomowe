import yahooFinance from 'yahoo-finance2';
import cron from 'node-cron';
import { storage } from '../storage';

interface PriceData {
  symbol: string;
  price: number;
  currency: string;
  marketCap?: number;
  change?: number;
  changePercent?: number;
}

class PriceService {
  private priceCache: Map<string, { price: number; lastUpdated: Date }> = new Map();

  constructor() {
    // Uruchamiamy aktualizację cen co 15 minut w godzinach handlowych
    cron.schedule('*/15 9-17 * * 1-5', () => {
      this.updateAllPrices();
    });

    // Aktualizuj ceny przy starcie serwera
    this.updateAllPrices();
  }

  async getPrice(symbol: string): Promise<number | null> {
    try {
      // Sprawdź cache (ważny przez 15 minut)
      const cached = this.priceCache.get(symbol);
      if (cached && Date.now() - cached.lastUpdated.getTime() < 15 * 60 * 1000) {
        return cached.price;
      }

      const quote = await yahooFinance.quote(symbol);
      const price = quote.regularMarketPrice || 0;
      
      // Zapisz w cache
      this.priceCache.set(symbol, {
        price,
        lastUpdated: new Date()
      });

      return price;
    } catch (error) {
      console.error(`Błąd pobierania ceny dla ${symbol}:`, error);
      
      // Zwróć ostatnią znaną cenę z cache jeśli dostępna
      const cached = this.priceCache.get(symbol);
      return cached?.price || null;
    }
  }

  async getMultiplePrices(symbols: string[]): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    
    try {
      // Pobierz ceny wsadowo dla lepszej wydajności
      const quotes = await yahooFinance.quote(symbols);
      
      if (Array.isArray(quotes)) {
        quotes.forEach((quote, index) => {
          const price = quote.regularMarketPrice || 0;
          const symbol = symbols[index];
          
          prices.set(symbol, price);
          this.priceCache.set(symbol, {
            price,
            lastUpdated: new Date()
          });
        });
      } else if (quotes && 'regularMarketPrice' in quotes) {
        const price = quotes.regularMarketPrice || 0;
        const symbol = symbols[0];
        
        prices.set(symbol, price);
        this.priceCache.set(symbol, {
          price,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Błąd pobierania wielu cen:', error);
      
      // Pobierz pojedynczo w przypadku błędu
      for (const symbol of symbols) {
        const price = await this.getPrice(symbol);
        if (price !== null) {
          prices.set(symbol, price);
        }
      }
    }
    
    return prices;
  }

  async updateAllPrices(): Promise<void> {
    try {
      const investments = await storage.getInvestments();
      if (investments.length === 0) return;

      const symbols = Array.from(new Set(investments.map(inv => inv.symbol)));
      console.log(`Aktualizuję ceny dla ${symbols.length} instrumentów...`);
      
      const prices = await this.getMultiplePrices(symbols);
      
      // Zaktualizuj ceny w bazie danych
      for (const investment of investments) {
        const newPrice = prices.get(investment.symbol);
        if (newPrice && newPrice > 0) {
          await storage.updateInvestment(investment.id, {
            currentPrice: newPrice.toString()
          } as any);
        }
      }
      
      console.log(`Zaktualizowano ceny dla ${prices.size} instrumentów`);
    } catch (error) {
      console.error('Błąd podczas aktualizacji cen:', error);
    }
  }

  async searchSymbol(query: string): Promise<any[]> {
    try {
      const results = await yahooFinance.search(query);
      return results.quotes?.slice(0, 10) || [];
    } catch (error) {
      console.error('Błąd wyszukiwania symboli:', error);
      return [];
    }
  }

  async getHistoricalData(symbol: string, period: string = '1y'): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      
      const historical = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: new Date(),
        interval: '1d'
      });

      return historical || [];
    } catch (error) {
      console.error(`Błąd pobierania danych historycznych dla ${symbol}:`, error);
      return [];
    }
  }
}

export const priceService = new PriceService();