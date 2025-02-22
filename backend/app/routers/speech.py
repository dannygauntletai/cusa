from fastapi import APIRouter, UploadFile, File
from app.services.speech_service import SpeechService
from ..logger import logger

router = APIRouter()
_speech_service = None

def get_speech_service():
    global _speech_service
    if _speech_service is None:
        logger.info("Initializing speech service...")
        _speech_service = SpeechService()
    return _speech_service

@router.post("/api/speech/transcribe")
async def transcribe_speech(audio: UploadFile = File(...)):
    logger.info(f"Received audio file: {audio.filename}, content_type: {audio.content_type}")
    service = get_speech_service()
    text = await service.transcribe_audio(audio)
    logger.info(f"Transcription result: {text}")
    return {"text": text} 