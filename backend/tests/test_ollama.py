import asyncio
import json
from backend.app.models import QuestionType, DifficultyLevel
from backend.app.educhain_client import generate_questions


async def test_question_type(
    question_type: QuestionType,
    topic: str = "Python programming basics",
    num_questions: int = 2
) -> None:
    """Test generation for a specific question type."""
    print(f"\nTesting {question_type} Questions:")
    print("=" * 50)
    
    try:
        questions = await generate_questions(
            topic=topic,
            question_type=question_type,
            num_questions=num_questions,
            difficulty=DifficultyLevel.MEDIUM,
            learning_objective="Understanding basic concepts",
            start_id=1
        )
        
        print("\nGenerated Questions:")
        for q in questions:
            print("\nQuestion Object:", json.dumps(q.model_dump(), indent=2))
            
        # Basic validation
        assert len(questions) == num_questions, "Wrong number of questions"
        for q in questions:
            assert q.type == question_type, "Wrong question type"
            assert q.question, "Missing question text"
            assert q.correctAnswer, "Missing answer"
            
            # Multiple choice should have options
            if question_type == QuestionType.MULTIPLE_CHOICE:
                assert q.options, "Multiple choice needs options"
            
        print(f"\n✅ {question_type} questions generated successfully!")
            
    except Exception as e:
        print(f"\n❌ Error testing {question_type}: {str(e)}")
        import traceback
        traceback.print_exc()


async def run_all_tests():
    """Run tests for all question types."""
    question_types = [
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.SHORT_ANSWER,
        QuestionType.TRUE_FALSE,
        QuestionType.FILL_IN_BLANK
    ]
    
    for qtype in question_types:
        await test_question_type(qtype)
        print("\n" + "-" * 80 + "\n")


if __name__ == "__main__":
    asyncio.run(run_all_tests()) 