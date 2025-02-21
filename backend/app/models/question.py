from typing import List, Optional
from sqlmodel import Field, SQLModel
from enum import Enum as PyEnum
from uuid import UUID, uuid4
from sqlalchemy import JSON, Column

class QuestionType(str, PyEnum):
    """Question types supported by the application."""
    MULTIPLE_CHOICE = "Multiple Choice"
    TRUE_FALSE = "True/False"
    SHORT_ANSWER = "Short Answer"
    FILL_IN_BLANK = "Fill in the Blank"

# Base Question Model for DB
class QuestionBase(SQLModel):
    """Base Question Model for DB."""
    text: str = Field(index=True)
    answer: str
    explanation: Optional[str] = None
    question_type: str = Field(...)  # Store as string in DB
    domain: Optional[str] = None
    # Use SQLAlchemy Column with JSON type for the options list
    options: Optional[List[str]] = Field(
        default=None,
        sa_column=Column(JSON)
    )

# Database Model
class Question(QuestionBase, table=True):
    """Database Model for questions."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)

# API Models
class QuestionCreate(SQLModel):
    """Schema for creating questions."""
    prompt: str = Field(
        ...,
        description="The topic or subject to generate questions about"
    )
    num_questions: int = Field(
        default=5,
        description="Number of questions to generate"
    )
    question_type: QuestionType = Field(
        default=QuestionType.TRUE_FALSE,
        description="Type of questions to generate"
    )
    domains: Optional[List[str]] = Field(
        default=None,
        description="List of domain names to focus questions on"
    )

class QuestionRead(QuestionBase):
    """Schema for reading questions."""
    id: UUID

class QuestionResponse(SQLModel):
    """Schema for question list response."""
    questions: List[QuestionRead]
    total: int

# Domain Models
class Domain(SQLModel):
    """Domain model."""
    name: str
    description: str

class DomainResponse(SQLModel):
    """Domain list response."""
    domains: List[Domain]
    single_domain: bool

class DomainCreate(SQLModel):
    """Schema for domain creation request."""
    prompt: str 