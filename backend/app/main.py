from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .models import QuizConfig, QuizRequest, QuizResponse, QuestionTypeConfig
from .quiz_generator import generate_quiz
from .logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting up CUSA Quiz API...")
    yield
    logger.info("Shutting down CUSA Quiz API...")


app = FastAPI(
    title="CUSA Quiz API",
    description="API for generating educational quizzes using local AI",
    version="1.0.0",
    lifespan=lifespan
)


# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/api/quiz", response_model=QuizResponse)
async def create_quiz(config: QuizConfig):
    """Generate quiz questions based on configuration."""
    try:
        logger.info(f"Generating quiz for topic: {config.topic}")
        questions = await generate_quiz(config)
        logger.info(f"Successfully generated {len(questions)} questions")
        return QuizResponse(questions=questions)
    except Exception as e:
        logger.error(f"Failed to generate quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/quiz/simple", response_model=QuizResponse)
async def create_simple_quiz(request: QuizRequest):
    """Generate quiz questions with simplified configuration."""
    try:
        logger.info(f"Generating simple quiz for topic: {request.topic}")
        
        # Convert simple request to full config
        config = QuizConfig(
            topic=request.topic,
            questionTypes=[
                QuestionTypeConfig(
                    type=request.question_type,
                    count=request.num_questions
                )
            ],
            difficultyLevel=request.difficulty,
            totalQuestions=request.num_questions
        )
        
        questions = await generate_quiz(config)
        logger.info(f"Successfully generated {len(questions)} questions")
        return QuizResponse(questions=questions)
    except Exception as e:
        logger.error(f"Failed to generate simple quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 