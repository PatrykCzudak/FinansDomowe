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