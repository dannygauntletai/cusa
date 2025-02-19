from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "Multiple Choice"
    TRUE_FALSE = "True/False"
    SHORT_ANSWER = "Short Answer"
    FILL_IN_BLANK = "Fill in the Blank"

class QuestionCreate(BaseModel):
    prompt: str = Field(..., description="The topic or subject to generate questions about")
    num_questions: int = Field(default=5, ge=1, le=20, description="Number of questions to generate")
    question_type: QuestionType = Field(default=QuestionType.TRUE_FALSE, description="Type of questions to generate")
    
class Question(BaseModel):
    question: str
    answer: bool
    explanation: Optional[str] = None

class QuestionResponse(BaseModel):
    questions: List[Question]
    total: int 