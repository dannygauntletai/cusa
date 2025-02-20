import os
from typing import List, Dict
import logging
from educhain import Educhain
from app.models.question import Question, QuestionCreate, QuestionResponse, Domain, QuestionType
from app.services.openai_service import generate_completion, generate_domain_topics
import uuid

logger = logging.getLogger(__name__)

# Initialize educhain client once
client = Educhain()

class QuestionService:
    def __init__(self):
        pass

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

            # Map our question type to educhain's expected format
            question_type_mapping = {
                QuestionType.TRUE_FALSE.value: "True/False",
                QuestionType.SHORT_ANSWER.value: "Short Answer",
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

                # Ensure answer is boolean for True/False questions
                if question_type == QuestionType.TRUE_FALSE.value:
                    answer = answer if isinstance(answer, bool) else str(answer).lower() == "true"

                questions.append(Question(
                    id=str(uuid.uuid4()),
                    text=question,
                    answer=str(answer),
                    explanation=explanation,
                    is_correct=None,
                    questionType=question_type,
                    options=["True", "False"] if question_type == QuestionType.TRUE_FALSE.value else None
                ))

            if not questions:
                raise ValueError("No valid questions generated")

            return questions

        except Exception as e:
            logger.error(f"Error in educhain question generation: {str(e)}")
            raise

    async def generate_diagnostic_questions(self, params: QuestionCreate) -> QuestionResponse:
        """Generate questions for diagnostic test (always True/False)"""
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

    async def extract_domains(self, prompt: str) -> List[Domain]:
        """Extract relevant learning domains from the given prompt using GPT"""
        try:
            return await generate_domain_topics(prompt)
        except Exception as e:
            logger.error(f"Error extracting domains: {str(e)}")
            return [
                Domain(
                    name="General Knowledge",
                    description=f"Core concepts and principles of {prompt}"
                )
            ]

    async def generate_questions(self, params: QuestionCreate) -> QuestionResponse:
        """Generate questions based on the provided parameters"""
        # TODO: Implement question generation logic here
        return QuestionResponse(questions=[], total=0)