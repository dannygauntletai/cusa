"""Database initialization script."""
from app.core.db import init_db
from app.models import *  # Import all models to register them

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized successfully!") 