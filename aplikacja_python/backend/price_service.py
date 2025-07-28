import yfinance as yf
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Investment
from datetime import datetime, timedelta
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PriceService:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        
    async def update_investment_prices(self):
        """Update current prices for all investments"""
        db = SessionLocal()
        try:
            investments = db.query(Investment).all()
            if not investments:
                logger.info("No investments to update")
                return
                
            symbols = [inv.symbol for inv in investments]
            logger.info(f"Updating prices for {len(symbols)} investments...")
            
            # Fetch prices from Yahoo Finance
            tickers = yf.Tickers(' '.join(symbols))
            
            updated_count = 0
            for investment in investments:
                try:
                    ticker = tickers.tickers[investment.symbol]
                    hist = ticker.history(period="1d")
                    
                    if not hist.empty:
                        current_price = float(hist['Close'].iloc[-1])
                        investment.current_price = current_price
                        updated_count += 1
                        logger.info(f"Updated {investment.symbol}: ${current_price:.2f}")
                    else:
                        logger.warning(f"No price data for {investment.symbol}")
                        
                except Exception as e:
                    logger.error(f"Failed to update price for {investment.symbol}: {e}")
                    
            db.commit()
            logger.info(f"Successfully updated {updated_count} investment prices")
            
        except Exception as e:
            logger.error(f"Failed to update investment prices: {e}")
            db.rollback()
        finally:
            db.close()
    
    async def get_stock_info(self, symbol: str):
        """Get detailed stock information"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="1y")
            
            return {
                "symbol": symbol,
                "name": info.get("longName", symbol),
                "current_price": info.get("currentPrice", 0),
                "market_cap": info.get("marketCap", 0),
                "pe_ratio": info.get("trailingPE", 0),
                "dividend_yield": info.get("dividendYield", 0),
                "52_week_high": info.get("fiftyTwoWeekHigh", 0),
                "52_week_low": info.get("fiftyTwoWeekLow", 0),
                "volume": info.get("volume", 0),
                "avg_volume": info.get("averageVolume", 0),
                "price_history": hist["Close"].tolist() if not hist.empty else []
            }
        except Exception as e:
            logger.error(f"Failed to get stock info for {symbol}: {e}")
            return None
    
    async def search_symbols(self, query: str):
        """Search for stock symbols"""
        try:
            # This is a simplified search - in production you'd use a proper API
            # For now, we'll try to validate if the symbol exists
            ticker = yf.Ticker(query.upper())
            info = ticker.info
            
            if info and "symbol" in info:
                return [{
                    "symbol": info.get("symbol", query.upper()),
                    "name": info.get("longName", "Unknown"),
                    "type": info.get("quoteType", "EQUITY"),
                    "exchange": info.get("exchange", "Unknown")
                }]
            return []
        except:
            return []
    
    def start_scheduler(self):
        """Start the price update scheduler"""
        # Update prices every 15 minutes during trading hours
        self.scheduler.add_job(
            self.update_investment_prices,
            'cron',
            minute='*/15',
            hour='9-16',  # Trading hours
            day_of_week='mon-fri',
            id='update_prices'
        )
        
        self.scheduler.start()
        logger.info("Price update scheduler started")
    
    def stop_scheduler(self):
        """Stop the price update scheduler"""
        self.scheduler.shutdown()
        logger.info("Price update scheduler stopped")

# Global price service instance
price_service = PriceService()