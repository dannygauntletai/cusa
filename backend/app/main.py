from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session

from .models import QuizConfig, QuizRequest, QuizResponse, QuestionTypeConfig
from .quiz_generator import generate_quiz
from .logger import logger
from .database import get_db
from .database_init import init_database
from .services.quiz_service import get_quiz_history, get_quiz_session
from .routers import speech


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting up CUSA Quiz API...")
    try:
        # Initialize database during startup
        init_database()
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise
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
async def create_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    """Generate quiz questions and store in database."""
    try:
        logger.info(f"Generating quiz for topic: {request.topic}")
        logger.info(f"Web search enabled: {request.use_web_search}")
        
        config = QuizConfig(
            topic=request.topic,
            questionTypes=[
                QuestionTypeConfig(
                    type=request.question_type,
                    count=request.num_questions
                )
            ],
            difficultyLevel=request.difficulty,
            totalQuestions=request.num_questions,
            use_web_search=request.use_web_search
        )
        
        questions = await generate_quiz(config, db)
        logger.info(f"Successfully generated {len(questions)} questions")
        return QuizResponse(questions=questions)
    except Exception as e:
        logger.error(f"Failed to generate quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/quiz/history")
def read_quiz_history(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    """Get quiz history with pagination."""
    return get_quiz_history(db, skip=skip, limit=limit)


@app.get("/api/quiz/{quiz_id}")
def read_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """Get a specific quiz session."""
    quiz = get_quiz_session(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


app.include_router(speech.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 