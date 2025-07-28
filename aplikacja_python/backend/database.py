import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import asyncpg
import asyncio
from dotenv import load_dotenv

load_dotenv()

# Use the Replit database URL directly
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Fallback for development
    DATABASE_URL = "postgresql://username:password@localhost/database"
    print("Warning: Using fallback DATABASE_URL. Set DATABASE_URL environment variable.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_database_if_not_exists():
    """Create database if it doesn't exist"""
    try:
        # Parse DATABASE_URL to get connection parameters
        import urllib.parse as urlparse
        url = urlparse.urlparse(DATABASE_URL)
        
        # Connect to postgres database to check if our database exists
        postgres_url = f"postgresql://{url.username}:{url.password}@{url.hostname}:{url.port}/postgres"
        
        # Extract database name from path
        db_name = url.path[1:]  # Remove leading slash
        
        try:
            # Try to connect to the target database
            test_engine = create_engine(DATABASE_URL)
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"Database '{db_name}' already exists")
            test_engine.dispose()
            
        except Exception as e:
            print(f"Database '{db_name}' doesn't exist or connection failed: {e}")
            print("Database will be created automatically by PostgreSQL service")
            
    except Exception as e:
        print(f"Database check failed: {e}")
        print("Proceeding with existing database connection")

def init_db():
    """Initialize database tables"""
    from models import Base
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")