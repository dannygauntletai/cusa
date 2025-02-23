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
    model_name=getenv("OLLAMA_MODEL", "mistral"),
    base_url=getenv("OLLAMA_HOST", "http://localhost:11434"),
    temperature=0.7
)

client = Educhain(llm_config)

def update_model(model_name: str) -> None:
    """Update the LLM model configuration."""
    global llm_config, client
    llm_config = LLMConfig(
        model_name=model_name,
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
    start_id: int,
    use_web_search: bool = False
) -> List[QuizQuestion]:
    """Generate questions using educhain with Ollama/Mistral."""
    print(f"educhain_client: web_search={use_web_search}")
    try:
        # Generate questions using educhain
        response = client.qna_engine.generate_questions(
            topic=topic,
            num=num_questions,
            question_type=question_type.value,
            difficulty=difficulty.value,
            learning_objective=learning_objective,
            web_search=use_web_search,
            max_web_results=3
        )

        # Convert to our QuizQuestion model based on type
        quiz_questions = []
        for i, q in enumerate(response.questions, start=start_id):
            # Handle different question types appropriately
            if isinstance(response, MCQList):
                options = q.options
            elif isinstance(response, TrueFalseQuestionList):
                options = ['True', 'False']
            elif isinstance(response, (ShortAnswerQuestionList, FillInBlankQuestionList)):
                options = None  # These types don't have options
            else:
                raise ValueError(f"Unexpected question type response: {type(response)}")

            quiz_question = QuizQuestion(
                id=i,
                question=q.question,
                options=options,
                correctAnswer=str(q.answer),
                type=question_type
            )
            quiz_questions.append(quiz_question)
            
        return quiz_questions
    except Exception as e:
        raise Exception(f"Failed to generate questions: {str(e)}") 