from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str  # "user" or "model" / "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    context_used: Optional[str] = None

class AboutResponse(BaseModel):
    app_name: str
    version: str
    tagline: str
    supported_topics: List[str]
    rag_ready: bool
