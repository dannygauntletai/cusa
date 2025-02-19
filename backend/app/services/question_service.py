import os
from typing import List
import logging
from educhain import Educhain
from app.models.question import Question, QuestionCreate, QuestionType

logger = logging.getLogger(__name__)

# Get API keys from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def generate_questions(question_create: QuestionCreate) -> List[Question]:
    """Generate questions using educhain based on the provided prompt"""
    try:
        # Initialize educhain client
        client = Educhain()
        
        # Map our question type to educhain's expected format
        question_type = (
            "True/False" 
            if question_create.question_type == QuestionType.TRUE_FALSE
            else question_create.question_type.value
        )
        
        # Generate questions using the QnA engine
        result = client.qna_engine.generate_questions(
            topic=question_create.prompt,
            num=question_create.num_questions,
            question_type=question_type,
            openai_api_key=OPENAI_API_KEY
        )
        
        # Convert educhain response to our Question model
        questions = []
        for q in result.questions:
            # Handle True/False questions
            if question_create.question_type == QuestionType.TRUE_FALSE:
                answer = q.answer if isinstance(q.answer, bool) else q.answer.lower() == "true"
                questions.append(
                    Question(
                        question=q.question,
                        answer=answer,
                        explanation=getattr(q, "explanation", None)
                    )
                )
            # For other question types, we'll need to handle them differently
            # Add support for other types as needed
        
        return questions
    
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise RuntimeError(f"Failed to generate questions: {str(e)}") 