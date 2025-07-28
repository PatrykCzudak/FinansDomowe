-- Database initialization script
-- This script is automatically executed when the PostgreSQL container starts

-- Create UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure the database exists
SELECT 'CREATE DATABASE budget_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'budget_db');

-- Connect to the budget_db database
\c budget_db;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    color VARCHAR NOT NULL DEFAULT '#3B82F6',
    budget DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR NOT NULL DEFAULT 'monthly',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category_id UUID NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    quantity DECIMAL(15,8) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2),
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    target_date DATE,
    category VARCHAR NOT NULL,
    color VARCHAR NOT NULL DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS savings_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    savings_goal_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investment_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID NOT NULL,
    investment_symbol VARCHAR NOT NULL,
    investment_name VARCHAR NOT NULL,
    quantity_sold DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    total_sale_value DECIMAL(10,2) NOT NULL,
    profit_loss DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data if tables are empty
INSERT INTO categories (name, color, budget) 
SELECT 'Jedzenie', '#22C55E', 1500.00
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Jedzenie');

INSERT INTO categories (name, color, budget) 
SELECT 'Transport', '#3B82F6', 500.00
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transport');

INSERT INTO categories (name, color, budget) 
SELECT 'Rozrywka', '#F59E0B', 800.00
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Rozrywka');

INSERT INTO incomes (name, amount, frequency, date) 
SELECT 'Wynagrodzenie', 5000.00, 'monthly', CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM incomes WHERE name = 'Wynagrodzenie');

INSERT INTO investments (symbol, name, type, quantity, purchase_price, current_price, purchase_date)
SELECT 'AAPL', 'Apple Inc.', 'stock', 10.0, 150.00, 180.00, CURRENT_DATE - INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM investments WHERE symbol = 'AAPL');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO budget_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO budget_user;