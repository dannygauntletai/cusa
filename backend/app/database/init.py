import os
from pathlib import Path
from sqlalchemy import inspect
from .database import engine, Base
from app.core.logger import logger

def init_database():
    """Initialize the database, creating tables if they don't exist."""
    try:
        # Create database directory if it doesn't exist
        db_dir = Path("./data")
        db_dir.mkdir(exist_ok=True)
        
        # Check if database file exists
        db_file = db_dir / "quiz.db"
        db_exists = db_file.exists()
        
        if not db_exists:
            logger.info("Creating new database...")
        else:
            logger.info("Database already exists, checking schema...")
        
        # Get existing tables
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        # Create tables that don't exist
        for table in Base.metadata.tables.keys():
            if table not in existing_tables:
                logger.info(f"Creating table: {table}")
                Base.metadata.tables[table].create(bind=engine)
        
        logger.info("Database initialization complete")
        return True
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise 