import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gemini_api_key: str = ""
    # Look for the system prompt relative to this file
    system_prompt_path: str = os.path.join(
        os.path.dirname(__file__), 
        "..", 
        "..", 
        "prompts", 
        "system_prompt.txt"
    )
    port: int = 8000
    host: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "..", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
