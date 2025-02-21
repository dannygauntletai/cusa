from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class QuizRequest(BaseModel):
    topic: str
    question_type: str
    num_questions: int = 5

@app.post("/generate")
async def generate_quiz(request: QuizRequest):
    try:
        # TODO: Implement quiz generation with educhain
        return {"message": "Quiz generation endpoint placeholder"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 