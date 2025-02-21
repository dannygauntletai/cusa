from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from app.models.question import (
    QuestionCreate, 
    QuestionResponse, 
    QuestionType, 
    DomainResponse,
    DomainCreate
)
from app.services.question_service import QuestionService
import logging


logger = logging.getLogger(__name__)
question_service = QuestionService()

# Add prefix to ensure all routes start with /questions
router = APIRouter(
    prefix="/questions",
    tags=["questions"]
)

@router.post("/domains", response_model=DomainResponse)
async def get_domains(params: DomainCreate) -> DomainResponse:
    """Extract relevant domains from the given prompt"""
    try:
        domains = await question_service.extract_domains(params)
        return DomainResponse(
            domains=domains,
            single_domain=len(domains) <= 1
        )
    except Exception as e:
        logger.error(f"Error extracting domains: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to extract domains"
        )


@router.post("/true-false", response_model=QuestionResponse)
async def generate_true_false(
    prompt: str = Body(...),
    domains: List[str] = Body(default=None),
) -> QuestionResponse:
    """Generate true/false questions"""
    logger.info(f"Received true/false request with prompt: {prompt}")
    try:
        params = QuestionCreate(
            prompt=prompt,
            num_questions=30,
            question_type=QuestionType.TRUE_FALSE,
            domains=domains
        )
        logger.info("Generating true/false questions...")
        result = await question_service.generate_diagnostic_questions(params)
        logger.info(f"Generated {len(result.questions)} questions")
        return result
    except Exception as e:
        logger.error(f"Error generating true/false questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/short-form", response_model=QuestionResponse)
async def generate_short_form(
    prompt: str = Body(...),
    domains: List[str] = Body(default=None),
) -> QuestionResponse:
    """Generate short-form questions"""
    logger.info(f"Received short-form request with prompt: {prompt}, domains: {domains}")
    try:
        params = QuestionCreate(
            prompt=prompt,
            num_questions=10,
            question_type=QuestionType.SHORT_ANSWER,
            domains=domains
        )
        logger.info("Generating short form questions...")
        result = await question_service.generate_short_form_questions(params)
        logger.info(f"Generated {len(result.questions)} questions")
        return result
    except Exception as e:
        logger.error(f"Error generating short-form questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multiple-choice", response_model=QuestionResponse)
async def generate_multiple_choice(
    prompt: str = Body(...),
    domains: List[str] = Body(default=None),
) -> QuestionResponse:
    """Generate multiple choice questions"""
    logger.info(f"Received multiple choice request with prompt: {prompt}")
    try:
        params = QuestionCreate(
            prompt=prompt,
            num_questions=10,
            question_type=QuestionType.MULTIPLE_CHOICE,
            domains=domains
        )
        logger.info("Generating multiple choice questions...")
        result = await question_service.generate_multiple_choice_questions(params)
        logger.info(f"Generated {len(result.questions)} questions")
        return result
    except Exception as e:
        logger.error(f"Error generating multiple choice questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fill-in-blank", response_model=QuestionResponse)
async def generate_fill_in_blank(
    prompt: str = Body(...),
    domains: List[str] = Body(default=None),
) -> QuestionResponse:
    """Generate fill in the blank questions"""
    logger.info(f"Received fill in blank request with prompt: {prompt}")
    try:
        params = QuestionCreate(
            prompt=prompt,
            num_questions=10,
            question_type=QuestionType.FILL_IN_BLANK,
            domains=domains
        )
        logger.info("Generating fill in blank questions...")
        result = await question_service.generate_fill_in_blank_questions(params)
        logger.info(f"Generated {len(result.questions)} questions")
        return result
    except Exception as e:
        logger.error(f"Error generating fill in blank questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=QuestionResponse)
async def get_questions(
    skip: int = 0,
    limit: int = 100,
    domain: str = None,
    question_type: QuestionType = None,
    question_service: QuestionService = Depends()
) -> QuestionResponse:
    """Get questions from database with optional filtering."""
    questions = await question_service.get_questions(
        skip=skip,
        limit=limit,
        domain=domain,
        question_type=question_type
    )
    return QuestionResponse(questions=questions, total=len(questions)) 