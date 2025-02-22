from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    WHISPER_MODEL: str = "medium"
    WHISPER_DEVICE: str = "cpu"  # Can be 'cpu', 'cuda', or 'mps'
    MAX_AUDIO_DURATION: int = 30  # seconds

    class Config:
        env_file = ".env"

def get_settings() -> Settings:
    return Settings() 