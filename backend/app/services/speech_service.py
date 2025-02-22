import whisper
import numpy as np
import torch
from fastapi import UploadFile, HTTPException
import io
from ..logger import logger
import soundfile as sf
from pydub import AudioSegment
from ..config import get_settings

settings = get_settings()

class SpeechService:
    def __init__(self):
        self.model = None
        self.device = None
    
    def _ensure_model_loaded(self):
        """Lazy load the model only when needed"""
        if self.model is None:
            try:
                logger.info("Loading Whisper model...")
                self.device = "cuda" if torch.cuda.is_available() else "cpu"
                logger.info(f"Using device: {self.device}")
                
                # Use the medium model for better accuracy
                logger.info(f"Loading {settings.WHISPER_MODEL} model...")
                self.model = whisper.load_model(settings.WHISPER_MODEL)
                self.model = self.model.to(self.device)
                logger.info("Whisper model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Whisper model: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to initialize Whisper model: {str(e)}"
                )
    
    async def transcribe_audio(self, audio_file: UploadFile) -> str:
        try:
            self._ensure_model_loaded()
            
            logger.info("Reading audio file...")
            audio_bytes = await audio_file.read()
            logger.info(f"Read {len(audio_bytes)} bytes of audio data")
            
            # Convert webm to wav using pydub
            logger.info("Converting audio format...")
            audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="webm")
            
            # Convert to mono and set sample rate
            audio = audio.set_channels(1)
            audio = audio.set_frame_rate(16000)
            
            # Get raw audio data as numpy array
            samples = np.array(audio.get_array_of_samples())
            
            # Convert to float32 and normalize
            audio_data = samples.astype(np.float32) / 32768.0
            
            logger.info(f"Audio processed: shape={audio_data.shape}, dtype={audio_data.dtype}")
            
            # Check duration
            duration = len(audio_data) / 16000
            if duration > settings.MAX_AUDIO_DURATION:
                logger.warning(f"Audio duration ({duration}s) exceeds limit")
                raise HTTPException(
                    status_code=400,
                    detail=f"Audio duration exceeds maximum of {settings.MAX_AUDIO_DURATION} seconds"
                )
            
            logger.info("Starting transcription...")
            # Add additional parameters for better accuracy
            result = self.model.transcribe(
                audio_data,
                language='en',  # Force English
                fp16=False,     # Avoid FP16 warning
                temperature=0.0  # Use greedy decoding
            )
            transcribed_text = result["text"].strip()
            logger.info(f"Transcription complete. Text: '{transcribed_text}'")
            return transcribed_text
            
        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}") 