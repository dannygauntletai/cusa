from fastapi import APIRouter, HTTPException
from app.models.question import QuestionCreate, QuestionResponse
from app.services.question_service import generate_questions

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/generate", response_model=QuestionResponse)
async def create_questions(question_create: QuestionCreate) -> QuestionResponse:
    """Generate questions based on the provided prompt"""
    try:
        questions = await generate_questions(question_create)
        return QuestionResponse(
            questions=questions,
            total=len(questions)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 