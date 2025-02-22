import json
from typing import List
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from ..models import QuizConfig, QuizQuestion
from ..database import QuizSession, StoredQuestion

def store_quiz_session(db: Session, config: QuizConfig, questions: List[QuizQuestion]) -> QuizSession:
    """Store a complete quiz session with its questions."""
    
    # Create quiz session
    db_quiz = QuizSession(
        topic=config.topic,
        difficulty_level=config.difficultyLevel,
        learning_objective=config.learningObjective,
        total_questions=config.totalQuestions,
        created_at=datetime.utcnow()
    )
    db.add(db_quiz)
    db.flush()  # Flush to get the quiz session ID
    
    # Create questions
    for question in questions:
        db_question = StoredQuestion(
            quiz_session_id=db_quiz.id,
            question_text=question.question,
            question_type=question.type,
            correct_answer=question.correctAnswer,
            options=json.dumps(question.options) if question.options else None
        )
        db.add(db_question)
    
    db.commit()
    return db_quiz

def get_quiz_history(db: Session, skip: int = 0, limit: int = 10) -> List[QuizSession]:
    """Retrieve quiz history with pagination."""
    return db.query(QuizSession)\
        .order_by(QuizSession.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_quiz_session(db: Session, quiz_id: int) -> QuizSession:
    """Retrieve a specific quiz session with its questions."""
    return db.query(QuizSession)\
        .filter(QuizSession.id == quiz_id)\
        .options(joinedload(QuizSession.questions))\
        .first() 