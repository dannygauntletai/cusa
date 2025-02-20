from openai import AsyncOpenAI
import json
from typing import List
import logging
from app.models.question import Domain, Question

logger = logging.getLogger(__name__)

# Initialize the OpenAI client once
client = AsyncOpenAI()

async def generate_completion(prompt: str) -> dict:
    """Generate completion using OpenAI API"""
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=500,
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)

async def generate_domain_topics(prompt: str) -> List[Domain]:
    """Generate a list of relevant domains for a given topic using GPT-3.5-turbo"""
    try:
        system_prompt = """
        You are a domain expert. Extract 3-5 core learning domains for the given topic.
        Each domain should be specific enough to generate focused questions but broad 
        enough to cover important subtopics.
        
        Return the response in JSON format with the following structure:
        {
            "domains": [
                {
                    "name": "Domain Name",
                    "description": "Brief description of the domain"
                }
            ]
        }
        """
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Topic: {prompt}"}
            ],
            temperature=0.7,
            max_tokens=500,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        response_data = json.loads(content)

        if not isinstance(response_data, dict) or 'domains' not in response_data:
            raise ValueError("Invalid response format: missing domains array")

        domains_data = response_data['domains']
        if not isinstance(domains_data, list):
            raise ValueError("Invalid response format: domains is not an array")

        domains = [
            Domain(name=d['name'], description=d['description'])
            for d in domains_data
            if isinstance(d, dict) and 'name' in d and 'description' in d
        ]

        return domains if domains else [
            Domain(
                name="General Knowledge",
                description=f"Core concepts and principles of {prompt}"
            )
        ]

    except json.JSONDecodeError as e:
        logger.error(f"Error parsing GPT response: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error generating domains with GPT: {str(e)}")
        raise

async def generate_questions_for_domain(
    prompt: str,
    domain: str,
    num_questions: int
) -> List[Question]:
    """Generate questions for a specific domain using GPT-3.5-turbo"""
    try:
        system_prompt = f"""
        Generate {num_questions} True/False questions about {prompt} focusing on 
        the domain: {domain}. Questions should be factual recall 
        (Webb's DOK Level 1).
        
        Return the response in JSON format:
        {{
            "questions": [
                {{
                    "question": "Question text here?",
                    "answer": true,
                    "explanation": "Brief explanation of the answer"
                }}
            ]
        }}
        """

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate questions for: {domain}"}
            ],
            temperature=0.7,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        questions_data = json.loads(content)

        return [
            Question(
                question=q["question"],
                answer=q["answer"],
                explanation=q.get("explanation")
            )
            for q in questions_data["questions"]
        ]

    except Exception as e:
        logger.error(f"Error generating questions for domain {domain}: {str(e)}")
        raise

# Export the functions
__all__ = ['generate_completion', 'generate_domain_topics', 'generate_questions_for_domain'] 