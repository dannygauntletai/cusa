import asyncio
import sys
from pathlib import Path

# Add backend directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.models import QuizConfig, QuestionTypeConfig, QuestionType, DifficultyLevel
from app.quiz_generator import generate_quiz

async def test_quiz_flow():
    """Test the complete quiz generation flow."""
    config = QuizConfig(
        topic="Python programming basics",
        questionTypes=[
            QuestionTypeConfig(type=QuestionType.MULTIPLE_CHOICE, count=2)
        ],
        difficultyLevel=DifficultyLevel.MEDIUM,
        totalQuestions=2
    )
    
    try:
        questions = await generate_quiz(config)
        print("\nGenerated Questions:")
        for q in questions:
            print(f"\nQuestion {q.id}:")
            print(f"Type: {q.type}")
            print(f"Q: {q.question}")
            if q.options:
                print("Options:", q.options)
            print(f"A: {q.correctAnswer}")
            
        return True
    except Exception as e:
        print(f"Error in quiz flow: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_quiz_flow())
    print("\nTest result:", "✅ Passed" if success else "❌ Failed") 