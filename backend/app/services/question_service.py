import os
from typing import List, Dict
import logging
from educhain import Educhain
from app.models.question import Question, QuestionCreate, QuestionResponse, Domain, QuestionType, DomainCreate
from app.services.openai_service import generate_completion, generate_domain_topics
import uuid
from uuid import UUID
from sqlmodel import Session
from app.core.db import get_db

logger = logging.getLogger(__name__)

# Initialize educhain client once
client = Educhain()

class QuestionService:
    def __init__(self):
        self._db = next(get_db())

    async def _generate_questions_with_educhain(
        self,
        topic: str,
        num_questions: int,
        question_type: str,
        domain: str | None = None,
        custom_instructions: str | None = None
    ) -> List[Question]:
        """Internal helper to generate questions using educhain"""
        try:
            # Add domain-specific instructions if provided
            domain_instructions = f"Focus on the domain: {domain}. " if domain else ""
            instructions = f"{domain_instructions}{custom_instructions or ''}"

            # Update question type mapping to include new types
            question_type_mapping = {
                QuestionType.TRUE_FALSE.value: "True/False",
                QuestionType.SHORT_ANSWER.value: "Short Answer",
                QuestionType.MULTIPLE_CHOICE.value: "Multiple Choice",
                QuestionType.FILL_IN_BLANK.value: "Fill in the Blank"
            }

            if question_type not in question_type_mapping:
                raise ValueError(f"Unsupported question type: {question_type}")

            educhain_type = question_type_mapping[question_type]
            
            logger.debug(f"Calling educhain with type: {educhain_type}")
            
            result = client.qna_engine.generate_questions(
                topic=topic,
                num=num_questions,
                question_type=educhain_type,
                custom_instructions=instructions.strip() or None
            )

            if not result or not hasattr(result, 'questions'):
                logger.error(f"Invalid educhain response: {result}")
                raise ValueError("Invalid response from educhain")

            # Parse questions from educhain response
            questions = []
            for q in result.questions:
                # Handle both dict and object formats
                question = q.question if hasattr(q, 'question') else q['question']
                answer = q.answer if hasattr(q, 'answer') else q['answer']
                explanation = (
                    q.explanation if hasattr(q, 'explanation') 
                    else q.get('explanation') if isinstance(q, dict) 
                    else None
                )
                options = (
                    q.options if hasattr(q, 'options')
                    else q.get('options') if isinstance(q, dict)
                    else None
                )

                # Type-specific processing
                if question_type == QuestionType.TRUE_FALSE.value:
                    answer = answer if isinstance(answer, bool) else str(answer).lower() == "true"
                    options = ["True", "False"]
                elif question_type == QuestionType.MULTIPLE_CHOICE.value:
                    if not options or len(options) < 2:
                        logger.warning(f"Invalid options for multiple choice: {options}")
                        continue
                elif question_type == QuestionType.FILL_IN_BLANK.value:
                    # Ensure the question contains a blank marker
                    if "___" not in question:
                        question = question.replace("[blank]", "___")
                    if "___" not in question:
                        logger.warning("Fill in blank question missing blank marker")
                        continue

                # Create Question object with the correct type
                question = Question(
                    text=question,
                    answer=str(answer),
                    explanation=explanation,
                    question_type=question_type,  # Already a string
                    domain=domain,
                    options=options
                )
                questions.append(question)

            if not questions:
                raise ValueError("No valid questions generated")

            # Save questions to database
            await self.save_questions(questions)
            return questions

        except Exception as e:
            logger.error(f"Error in educhain question generation: {str(e)}")
            raise

    async def save_questions(self, questions: List[Question]) -> None:
        """Save generated questions to database."""
        try:
            for question in questions:
                # Only convert if it's an enum
                if isinstance(question.question_type, QuestionType):
                    question.question_type = question.question_type.value
                self._db.add(question)
            self._db.commit()
        except Exception as e:
            self._db.rollback()
            logger.error(f"Error saving questions: {str(e)}")
            raise

    async def get_questions(
        self, 
        skip: int = 0, 
        limit: int = 100,
        domain: str = None,
        question_type: QuestionType = None
    ) -> List[Question]:
        """Retrieve questions from database with optional filtering."""
        query = self._db.query(Question)
        
        if domain:
            query = query.filter(Question.domain == domain)
        if question_type:
            query = query.filter(Question.question_type == question_type.value)
            
        return query.offset(skip).limit(limit).all()

    async def generate_diagnostic_questions(self, params: QuestionCreate) -> QuestionResponse:
        """Generate and store diagnostic questions."""
        try:
            all_questions = []
            
            if params.domains:
                # Calculate questions per domain
                questions_per_domain = params.num_questions // len(params.domains)
                remainder = params.num_questions % len(params.domains)
                
                # Generate questions for each domain
                for i, domain in enumerate(params.domains):
                    domain_questions = questions_per_domain + (remainder if i == 0 else 0)
                    
                    questions = await self._generate_questions_with_educhain(
                        topic=params.prompt,
                        num_questions=domain_questions,
                        question_type=QuestionType.TRUE_FALSE.value,  # Always TRUE_FALSE for diagnostic
                        domain=domain,
                        custom_instructions="Generate factual recall questions (Webb's DOK Level 1). Questions should be clear and unambiguous."
                    )
                    all_questions.extend(questions)
            else:
                all_questions = await self._generate_questions_with_educhain(
                    topic=params.prompt,
                    num_questions=params.num_questions,
                    question_type=QuestionType.TRUE_FALSE.value
                )

            # Store questions in database
            await self.save_questions(all_questions)
            
            return QuestionResponse(questions=all_questions, total=len(all_questions))

        except Exception as e:
            logger.error(f"Error generating diagnostic questions: {str(e)}")
            raise

    async def generate_short_form_questions(self, params: QuestionCreate) -> QuestionResponse:
        """Generate short form questions for level 2"""
        try:
            all_questions = []
            
            if params.domains:
                questions_per_domain = params.num_questions // len(params.domains)
                remainder = params.num_questions % len(params.domains)
                
                for i, domain in enumerate(params.domains):
                    domain_questions = questions_per_domain + (remainder if i == 0 else 0)
                    
                    questions = await self._generate_questions_with_educhain(
                        topic=params.prompt,
                        num_questions=domain_questions,
                        question_type=QuestionType.SHORT_ANSWER.value,
                        domain=domain,
                        custom_instructions="Generate questions that test understanding and application (Webb's DOK Level 2)."
                    )
                    all_questions.extend(questions)
            else:
                all_questions = await self._generate_questions_with_educhain(
                    topic=params.prompt,
                    num_questions=params.num_questions,
                    question_type=QuestionType.SHORT_ANSWER.value
                )

            return QuestionResponse(questions=all_questions, total=len(all_questions))

        except Exception as e:
            logger.error(f"Error generating short form questions: {str(e)}")
            raise

    async def extract_domains(self, params: DomainCreate) -> List[Domain]:
        """Extract relevant learning domains from the given prompt using GPT"""
        try:
            return await generate_domain_topics(params.prompt)
        except Exception as e:
            logger.error(f"Error extracting domains: {str(e)}")
            return [
                Domain(
                    name="General Knowledge",
                    description=f"Core concepts and principles of {params.prompt}"
                )
            ]

    async def generate_multiple_choice_questions(
        self, 
        params: QuestionCreate
    ) -> QuestionResponse:
        """Generate multiple choice questions"""
        try:
            all_questions = []
            
            if params.domains:
                questions_per_domain = params.num_questions // len(params.domains)
                remainder = params.num_questions % len(params.domains)
                
                for i, domain in enumerate(params.domains):
                    domain_questions = questions_per_domain + (remainder if i == 0 else 0)
                    
                    questions = await self._generate_questions_with_educhain(
                        topic=params.prompt,
                        num_questions=domain_questions,
                        question_type=QuestionType.MULTIPLE_CHOICE.value,
                        domain=domain,
                        custom_instructions=(
                            "Generate multiple choice questions with 4 options. "
                            "Ensure options are distinct and plausible. "
                            "One option must be clearly correct."
                        )
                    )
                    all_questions.extend(questions)
            else:
                all_questions = await self._generate_questions_with_educhain(
                    topic=params.prompt,
                    num_questions=params.num_questions,
                    question_type=QuestionType.MULTIPLE_CHOICE.value
                )

            return QuestionResponse(questions=all_questions, total=len(all_questions))

        except Exception as e:
            logger.error(f"Error generating multiple choice questions: {str(e)}")
            raise

    async def generate_fill_in_blank_questions(
        self, 
        params: QuestionCreate
    ) -> QuestionResponse:
        """Generate fill in the blank questions"""
        try:
            all_questions = []
            
            if params.domains:
                questions_per_domain = params.num_questions // len(params.domains)
                remainder = params.num_questions % len(params.domains)
                
                for i, domain in enumerate(params.domains):
                    domain_questions = questions_per_domain + (remainder if i == 0 else 0)
                    
                    questions = await self._generate_questions_with_educhain(
                        topic=params.prompt,
                        num_questions=domain_questions,
                        question_type=QuestionType.FILL_IN_BLANK.value,
                        domain=domain,
                        custom_instructions=(
                            "Generate fill in the blank questions using ___ as blank marker. "
                            "Ensure blanks test key concepts and have unambiguous answers."
                        )
                    )
                    all_questions.extend(questions)
            else:
                all_questions = await self._generate_questions_with_educhain(
                    topic=params.prompt,
                    num_questions=params.num_questions,
                    question_type=QuestionType.FILL_IN_BLANK.value
                )

            return QuestionResponse(questions=all_questions, total=len(all_questions))

        except Exception as e:
            logger.error(f"Error generating fill in blank questions: {str(e)}")
            raise