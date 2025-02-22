from sqlalchemy import create_engine, Column, Integer, String, Enum as SQLEnum, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from pathlib import Path
from typing import List
import enum

from .models import QuestionType, DifficultyLevel

# Create database directory if it doesn't exist
db_dir = Path("./data")
db_dir.mkdir(exist_ok=True)

# Create SQLAlchemy engine with the new path
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_dir}/quiz.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()

class QuizSession(Base):
    """Represents a quiz session in the database."""
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    difficulty_level = Column(SQLEnum(DifficultyLevel))
    learning_objective = Column(String, nullable=True)
    total_questions = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to questions
    questions = relationship("StoredQuestion", back_populates="quiz_session")

class StoredQuestion(Base):
    """Represents a stored quiz question in the database."""
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_session_id = Column(Integer, ForeignKey("quiz_sessions.id"))
    question_text = Column(String)
    question_type = Column(SQLEnum(QuestionType))
    correct_answer = Column(String)
    options = Column(String, nullable=True)  # Store as JSON string
    
    # Relationship to quiz session
    quiz_session = relationship("QuizSession", back_populates="questions")

# Create database tables
Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 