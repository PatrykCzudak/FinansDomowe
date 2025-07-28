-- Initialize Budget Management Database
-- This script creates the database if it doesn't exist and sets up basic configuration

-- Create database (will be ignored if already exists)
SELECT 'CREATE DATABASE budgetdb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'budgetdb')\gexec

-- Connect to the database
\c budgetdb;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Basic configuration
SET timezone = 'UTC';

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE '✅ Database budgetdb initialized successfully';
END $$;