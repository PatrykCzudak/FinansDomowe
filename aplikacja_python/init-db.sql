-- Initialize budget database

-- Connect to the budget database (created by POSTGRES_DB)
\c budget_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they do not exist
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    budget DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    date VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category_id UUID NOT NULL,
    date VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    quantity DECIMAL(15,8) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2),
    purchase_date VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    target_date VARCHAR(10) NOT NULL,
    category VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data (insert only if missing)
INSERT INTO categories (id, name, color, budget)
SELECT uuid_generate_v4(), 'Żywność', '#10B981', 1500.00
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Żywność');

INSERT INTO categories (id, name, color, budget)
SELECT uuid_generate_v4(), 'Transport', '#3B82F6', 500.00
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transport');

INSERT INTO categories (id, name, color, budget)
SELECT uuid_generate_v4(), 'Rozrywka', '#8B5CF6', 300.00
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Rozrywka');

INSERT INTO incomes (id, name, amount, frequency, date)
SELECT uuid_generate_v4(), 'Pensja', 5000.00, 'monthly', CURRENT_DATE::text
WHERE NOT EXISTS (SELECT 1 FROM incomes WHERE name = 'Pensja');

INSERT INTO investments (id, symbol, name, type, quantity, purchase_price, purchase_date)
SELECT uuid_generate_v4(), 'AAPL', 'Apple Inc.', 'stock', 10.00000000, 150.00, (CURRENT_DATE - INTERVAL '30 days')::text
WHERE NOT EXISTS (SELECT 1 FROM investments WHERE symbol = 'AAPL');

INSERT INTO savings_goals (id, title, target_amount, current_amount, target_date, category, color)
SELECT uuid_generate_v4(), 'Wakacje', 5000.00, 1200.00, (CURRENT_DATE + INTERVAL '6 months')::text, 'Wypoczynek', '#F59E0B'
WHERE NOT EXISTS (SELECT 1 FROM savings_goals WHERE title = 'Wakacje');

