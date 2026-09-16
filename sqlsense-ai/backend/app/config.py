import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    port: int = 8000
    host: str = "0.0.0.0"

    # Base paths relative to this file (backend/app/config.py)
    # backend/app -> backend -> sqlsense-ai
    knowledge_dir: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "knowledge")
    )
    frontend_dist_dir: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
    )

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "..", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
