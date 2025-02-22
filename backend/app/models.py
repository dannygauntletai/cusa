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


class QuizQuestion(BaseModel):
    model_config = ConfigDict(extra='forbid')
    id: int
    question: str
    options: Optional[List[str]] = None  # For multiple choice
    correctAnswer: str
    type: QuestionType


class QuizConfig(BaseModel):
    model_config = ConfigDict(extra='forbid')
    topic: str
    questionTypes: List[QuestionTypeConfig]
    difficultyLevel: DifficultyLevel
    learningObjective: Optional[str] = None
    use_web_search: bool = False
    totalQuestions: int = Field(gt=0, le=20)
    questions: Optional[List[QuizQuestion]] = None


class QuizRequest(BaseModel):
    """Request model for quiz generation."""
    topic: str
    question_type: QuestionType
    num_questions: int = Field(default=5, gt=0, le=10)
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    use_web_search: bool = False


class QuizResponse(BaseModel):
    """Response model containing generated quiz questions."""
    questions: List[QuizQuestion] 