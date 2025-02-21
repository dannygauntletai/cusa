"""Database connection and session management."""
import json
from pathlib import Path
from collections.abc import Generator
from sqlalchemy import create_engine, event
from sqlmodel import Session, SQLModel

from app.core.config import settings

# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28

# Initialize SQLite database engine with thread safety for FastAPI
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Add JSON handling for SQLite
@event.listens_for(engine, 'connect')
def _enable_json(dbapi_connection, connection_record):
    """Enable JSON support for SQLite connection."""
    # Create JSON functions for SQLite
    if 'sqlite' in engine.dialect.name:
        dbapi_connection.create_function('json', 1, json.dumps)
        dbapi_connection.create_function('json_extract', 2, json.loads)


VERSION_FILE = Path("db_version.json")


def get_db() -> Generator[Session, None]:
    """Get database session."""
    with Session(engine) as session:
        yield session


def get_db_version() -> int:
    """Get current database version."""
    if not VERSION_FILE.exists():
        return 0
    with VERSION_FILE.open() as f:
        return json.load(f).get("version", 0)


def set_db_version(version: int) -> None:
    """Set current database version."""
    with VERSION_FILE.open("w") as f:
        json.dump({"version": version}, f)


def init_db() -> None:
    """Initialize database tables."""
    current_version = get_db_version()
    
    if current_version < 1:
        # Create initial schema
        SQLModel.metadata.create_all(engine)
        set_db_version(1)
    
    # Add more version checks and migrations here
    # if current_version < 2:
    #     with Session(engine) as session:
    #         session.execute(text("ALTER TABLE item ADD COLUMN new_field TEXT"))
    #         session.commit()
