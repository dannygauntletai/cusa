from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.clients.educhain_client import update_model

router = APIRouter()

class ModelUpdate(BaseModel):
    model_name: str

@router.post("/api/settings/model")
async def update_llm_model(model_update: ModelUpdate):
    try:
        update_model(model_update.model_name)
        return {"status": "success", "message": f"Model updated to {model_update.model_name}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 