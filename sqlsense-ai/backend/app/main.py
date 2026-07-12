import os
import sys
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import ChatRequest, ChatResponse, AboutResponse
from app.services.gemini import generate_chat_response

# Add backend directory to path to resolve RAG module imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from rag.chat import process_chat_message

# Configure logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sqlsense-ai")

# Initialize FastAPI App
app = FastAPI(
    title="SQLSense AI Backend",
    description="Intelligent SQL Learning Assistant API",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    has_key = bool(settings.gemini_api_key)
    logger.info(f"Gemini Key Loaded : {has_key}")
    print(f"Gemini Key Loaded : {has_key}")

@app.get("/health", tags=["System"])
def health_check():
    """
    Checks backend health.
    Returns status 200 if server is running.
    """
    # Check if Gemini key is loaded
    has_api_key = bool(settings.gemini_api_key)
    return {
        "status": "healthy",
        "gemini_api_key_configured": has_api_key
    }

@app.get("/about", response_model=AboutResponse, tags=["Metadata"])
def get_about():
    """
    Returns app metadata including supported topics list.
    """
    supported_topics = [
        "Create Table", "Insert", "Update", "Delete", "Truncate", "Drop",
        "Select", "Where", "Order By", "Group By", "Having", "Aggregate Functions",
        "Primary Key", "Foreign Key", "Inner Join", "Left Join", "Right Join", 
        "Full Join", "Cross Join", "Self Join", "Union", "Union All", "Views",
        "Indexes", "Normalization", "Subqueries", "CTE", "Window Functions",
        "Transactions", "Stored Procedures", "Triggers"
    ]
    return AboutResponse(
        app_name="SQLSense AI",
        version="1.0.0",
        tagline="Your Intelligent SQL Learning Assistant",
        supported_topics=supported_topics,
        rag_ready=True
    )

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
def chat_endpoint(request: ChatRequest):
    """
    Processes chat conversations through the LangChain + ChromaDB RAG pipeline,
    retrieving relevant SQL documentation.
    """
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
        
    logger.info("Routing chat request with message to RAG pipeline...")
    
    return process_chat_message(request)

if __name__ == "__main__":
    import uvicorn
    # Allow running the file directly
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
