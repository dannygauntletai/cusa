from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "Multiple Choice"
    TRUE_FALSE = "True/False"
    SHORT_ANSWER = "Short Answer"
    FILL_IN_BLANK = "Fill in the Blank"

class Domain(BaseModel):
    name: str
    description: str

class DomainResponse(BaseModel):
    domains: List[Domain]
    single_domain: bool

class QuestionCreate(BaseModel):
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

class Question(BaseModel):
    id: str
    text: str
    answer: str
    explanation: Optional[str] = None
    is_correct: Optional[bool] = None
    domain: Optional[str] = None
    questionType: str
    options: Optional[List[str]] = None

class QuestionResponse(BaseModel):
    questions: List[Question]
    total: int

class DomainCreate(BaseModel):
    """Schema for domain creation request"""
    prompt: str 