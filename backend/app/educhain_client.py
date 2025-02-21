from typing import List, Optional
from os import getenv
from dotenv import load_dotenv
from app.models import QuestionType, DifficultyLevel, QuizQuestion
from educhain.core.educhain import Educhain
from educhain.core.config import LLMConfig
from educhain.models.qna_models import (
    MCQList,
    ShortAnswerQuestionList,
    TrueFalseQuestionList,
    FillInBlankQuestionList
)

# Load environment variables
load_dotenv()

# Configure Ollama client
llm_config = LLMConfig(
    model_name="mistral",
    base_url=getenv("OLLAMA_HOST", "http://localhost:11434"),
    temperature=0.7
)

client = Educhain(llm_config)

async def generate_questions(
    topic: str,
    question_type: QuestionType,
    num_questions: int,
    difficulty: DifficultyLevel,
    learning_objective: Optional[str],
    start_id: int
) -> List[QuizQuestion]:
    """Generate questions using educhain with Ollama/Mistral."""
    try:
        # Generate questions using educhain
        response = client.qna_engine.generate_questions(
            topic=topic,
            num=num_questions,
            question_type=question_type.value,
            difficulty=difficulty.value,
            learning_objective=learning_objective
        )

        # Convert to our QuizQuestion model based on type
        quiz_questions = []
        for i, q in enumerate(response.questions, start=start_id):
            # Handle different question types appropriately
            if isinstance(response, MCQList):
                options = q.options
            elif isinstance(response, TrueFalseQuestionList):
                options = ['True', 'False']
            else:
                options = None

            quiz_question = QuizQuestion(
                id=i,
                question=q.question,
                options=options,
                correctAnswer=str(q.answer),  # Convert bool to str for True/False
                type=question_type
            )
            quiz_questions.append(quiz_question)
            
        return quiz_questions
    except Exception as e:
        raise Exception(f"Failed to generate questions: {str(e)}") 