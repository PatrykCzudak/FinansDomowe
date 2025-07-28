# Personal Budget Management Application

## Overview

This is a full-stack personal budget management application built with React, TypeScript, Express.js, and PostgreSQL. The application provides comprehensive financial tracking including categories, income, expenses, and investments with interactive charts and data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Pattern**: RESTful API design
- **Error Handling**: Centralized error middleware
- **Request Logging**: Custom middleware for API request logging

### Database Architecture
- **Primary Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage implementation for development/testing

## Key Components

### Data Models
- **Categories**: Budget categories with names, colors, and budget limits
- **Income**: Income sources with amounts and frequency
- **Expenses**: Individual expense records linked to categories
- **Investments**: Investment portfolio tracking with purchase/current prices

### Frontend Pages
- **Admin/Budget**: Category and income management
- **Expenses**: Expense tracking and categorization
- **Summary**: Financial overview with charts and analytics
- **Investments**: Portfolio management with three tabs:
  - Portfolio: Investment holdings, allocation charts, performance tracking
  - AI Asystent: Automated financial analysis and recommendations
  - Dane Rynkowe: Real-time price updates and market data search

### UI Components
- **Forms**: Category, Income, Expense, and Investment forms with validation
- **Charts**: Budget comparison, category breakdown, trends, allocation, and performance charts
- **AI Components**: AI Assistant with portfolio/budget analysis and custom queries
- **Price Components**: Price updater with Yahoo Finance integration and symbol search
- **Layout**: Header navigation and tabbed interface

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle CRUD operations for all entities
3. **Data Validation**: Zod schemas validate incoming data on both client and server
4. **Database Operations**: Drizzle ORM performs type-safe database queries
5. **Response Handling**: Standardized JSON responses with error handling
6. **State Updates**: React Query automatically updates UI when data changes

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Uses DATABASE_URL environment variable

### Market Data APIs
- **Yahoo Finance**: Real-time stock prices, ETF data, market indices
- **Auto-updates**: Scheduled price updates every 15 minutes during trading hours
- **Symbol Search**: Company and instrument search functionality
- **Historical Data**: Price history and performance tracking

### AI Services
- **AI Assistant**: Intelligent financial analysis and recommendations
- **Portfolio Analysis**: Automated diversification and performance insights
- **Budget Analysis**: Spending pattern recognition and optimization suggestions
- **Custom Queries**: Interactive financial advice system

### Development Tools
- **Replit Integration**: Cartographer plugin for Replit environment
- **Error Overlay**: Runtime error modal for development
- **Task Scheduling**: Node-cron for automated price updates

### UI Libraries
- **Radix UI**: Headless UI components for accessibility
- **Lucide Icons**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for UI enhancement

## Deployment Strategy

### Development
- **Command**: `npm run dev` - Runs Express server with tsx for TypeScript execution
- **Hot Reload**: Vite development server integrated with Express
- **Database**: Uses Drizzle Kit for schema synchronization

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Command**: `npm run build` followed by `npm start`

### Database Management
- **Migrations**: Generated in `./migrations` directory
- **Schema**: Centralized in `shared/schema.ts`
- **Push**: `npm run db:push` applies schema changes

The application follows a monorepo structure with shared TypeScript types between client and server, ensuring type safety across the full stack. The modular architecture allows for easy extension of financial tracking features.

## Recent Changes: Latest modifications with dates

### 2025-01-28: Month Selector & Dark Mode Implementation
- **Month Context**: Added global month context (`MonthProvider`) that controls expense filtering across the entire application
- **Header Month Selector**: Replaced static "Lipiec 2025" badge with interactive `MonthSelector` dropdown in header
- **Month-based Expense Filtering**: Expenses are now filtered by the selected month from the header, while budgets remain persistent
- **Expense Form Integration**: New expenses default to the selected month, supporting browsing of historical data
- **Dark/Light Mode Toggle**: Added `ThemeProvider` and `ThemeToggle` component with CSS variables for consistent theming
- **UI Improvements**: Updated all components to support dark mode with proper contrast and styling

### 2025-01-28: Savings Goals & Enhanced UX Features
- **Savings Goals Module**: Complete savings tracking system with PostgreSQL database integration
  - New `savingsGoals` table with target amounts, current progress, dates, categories, and colors
  - API endpoints for CRUD operations and adding savings amounts
  - Progress tracking with percentage completion and monthly savings calculators
  - Visual goal cards with progress bars and deadline tracking
- **Enhanced Navigation**: Savings Goals positioned as 3rd tab in main navigation
- **Floating Expense Button**: Quick-add button for expenses accessible from any page with category selection
- **Search Functionality**: Real-time expense search by description, category, or amount on expenses page
- **Database Integration**: All savings data persisted to PostgreSQL with proper schema validation
- **UX Improvements**: Responsive design, color-coded categories, and intuitive goal management interface

### 2025-01-28: Advanced Investment Risk Analysis & Enhanced AI Assistant
- **Risk Analysis Module**: Comprehensive risk analysis module with classical statistical methods
  - New "Ryzyko" tab in investment section with 4 sub-modules: VaR, Expected Shortfall, Risk Metrics, Stress Testing
  - Value at Risk (VaR) calculations with customizable confidence levels and time horizons
  - Expected Shortfall (ES) analysis for tail risk assessment
  - Additional risk metrics: Beta, Sharpe Ratio, Maximum Drawdown, Volatility
  - Stress testing with historical crisis scenarios (2008 crash, COVID-19, market corrections)
- **Enhanced AI Assistant**: Multi-tab AI assistant with advanced capabilities
  - **Classic Analysis**: Portfolio, budget, and recommendation analysis
  - **AI Models**: LSTM Neural Networks, Bayesian LSTM, CNN+Transformer, CatBoost ML models
  - **Forecasting**: Asset price prediction with multiple time horizons
  - **Optimization**: Markowitz portfolio optimization and AI-enhanced optimization with machine learning
- **UI Improvements**: Added AlertTriangle icon, improved tab navigation, color-coded risk metrics
- **Modular Architecture**: Separated risk analysis into dedicated component for scalability

### 2025-01-28: Complete Python FastAPI Backend & React Frontend Architecture
- **New Python Implementation**: Created exact duplicate of the application in `aplikacja_python/` folder
  - **Backend**: Python FastAPI with SQLAlchemy ORM, PostgreSQL integration, uvicorn server
  - **Frontend**: React + TypeScript copied from main app with API endpoint configuration
  - **Docker Setup**: Complete containerization with docker-compose.yml orchestration
  - **Database**: PostgreSQL with automatic initialization and sample data seeding
  - **Scripts**: Automated start.sh/stop.sh for complete application lifecycle management
- **FastAPI Features**: All financial management endpoints implemented
  - Categories, Incomes, Expenses, Investments, Savings Goals CRUD operations
  - Yahoo Finance integration with yfinance library for real-time price updates
  - AI Assistant endpoints for portfolio and budget analysis with pandas/numpy
  - Risk analysis endpoints with VaR/Expected Shortfall calculations
  - Automated price updates every 15 minutes with APScheduler
- **Docker Infrastructure**: Production-ready containerized deployment
  - PostgreSQL container with health checks and volume persistence
  - FastAPI backend container with automatic reload in development
  - React frontend with nginx reverse proxy for API routing
  - Automated service dependency management and startup sequence
- **User-Friendly Scripts**: Complete automation for non-technical users
  - `start.sh` - One-command startup with health monitoring, browser opening
  - `stop.sh` - Graceful shutdown with options for data/image cleanup
  - Comprehensive error handling and status reporting
  - Automatic .env file creation with secure defaults

### 2025-01-28: Complete Python FastAPI Backend Implementation
- **New Backend Architecture**: Complete rebuilding of Python FastAPI backend with proper structure
  - **Backend Structure**: Modular Python FastAPI with separated concerns
    - `main.py` - Application entry point with lifespan management
    - `database.py` - PostgreSQL connection and session management
    - `models.py` - SQLAlchemy ORM models with proper DECIMAL types
    - `schemas.py` - Pydantic schemas for request/response validation
    - `routers/` - Separated API routers (categories, incomes, expenses, investments, savings, ai, prices)
    - `services/` - Business logic services (price_service, ai_service)
  - **Removed Node.js Dependencies**: Eliminated all TypeScript/Node.js backend code from aplikacja_python
  - **API Endpoints**: Complete FastAPI implementation matching original Node.js functionality
    - Categories CRUD with budget limits
    - Incomes with frequency types (monthly, weekly, one-time)  
    - Expenses with date filtering by year/month
    - Investments with profit/loss calculations
    - Savings goals with progress tracking
    - AI analysis for portfolio and budget insights
    - Price service with Yahoo Finance integration
- **Frontend Configuration**: Updated React frontend to communicate with Python backend
  - Modified `queryClient.ts` to point to `http://localhost:8000`
  - Copied all UI components from main application
  - Maintained identical user interface and functionality
- **Database Integration**: SQLAlchemy with PostgreSQL using existing Replit database
  - Automatic table creation on startup
  - UUID primary keys for all entities
  - DECIMAL types for financial amounts
  - Proper foreign key relationships