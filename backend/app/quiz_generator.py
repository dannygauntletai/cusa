from typing import List
import asyncio
from sqlalchemy.orm import Session
from app.models import QuizConfig, QuizQuestion
from app.educhain_client import generate_questions
from app.services.quiz_service import store_quiz_session


async def generate_quiz(config: QuizConfig, db: Session) -> List[QuizQuestion]:
    """Generate quiz questions using educhain and store in database."""
    try:
        # Generate questions for each type in parallel
        tasks = []
        question_id = 1
        
        for qt in config.questionTypes:
            task = generate_questions(
                topic=config.topic,
                question_type=qt.type,
                num_questions=qt.count,
                difficulty=config.difficultyLevel,
                learning_objective=config.learningObjective,
                start_id=question_id
            )
            tasks.append(task)
            question_id += qt.count
        
        # Wait for all question generation tasks to complete
        question_sets = await asyncio.gather(*tasks)
        
        # Flatten the list of questions
        questions = [q for qset in question_sets for q in qset]
        
        # Store the quiz session and questions in the database
        store_quiz_session(db, config, questions)
        
        return questions
    except Exception as e:
        raise Exception(f"Failed to generate quiz: {str(e)}") 