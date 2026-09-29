from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    mode: Optional[str] = "smart_assistant"  # "smart_assistant" | "explain_concept" | "optimize_query" | "debug_error"

class ChatResponse(BaseModel):
    reply: str
    context_used: Optional[str] = None
    mode: Optional[str] = "smart_assistant"

class AboutResponse(BaseModel):
    app_name: str
    version: str
    tagline: str
    supported_topics: List[str]
    rag_ready: bool

class QuizQuestionItem(BaseModel):
    id: str
    topic: str
    difficulty: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str

class QuizResponse(BaseModel):
    difficulty: str
    count: int
    questions: List[QuizQuestionItem]
