from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "Multiple Choice"
    SHORT_ANSWER = "Short Answer"
    TRUE_FALSE = "True/False"
    FILL_IN_BLANK = "Fill in the Blank"

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class QuestionTypeConfig(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    type: QuestionType
    count: int = Field(gt=0, le=10)

class QuizConfig(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    topic: str
    questionTypes: List[QuestionTypeConfig]
    difficultyLevel: DifficultyLevel
    learningObjective: Optional[str] = None
    totalQuestions: int = Field(gt=0, le=20)

class QuizQuestion(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    id: int
    question: str
    options: Optional[List[str]] = None  # For multiple choice
    correctAnswer: str
    type: QuestionType

class QuizResponse(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    questions: List[QuizQuestion] 