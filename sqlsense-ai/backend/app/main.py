import os
import sys
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from app.config import settings
from app.schemas import ChatRequest, ChatResponse, AboutResponse
from app.services.sql_engine import get_sql_engine

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sqlsense-ai")

# Initialize FastAPI App
app = FastAPI(
    title="SQLSense AI Backend",
    description="Intelligent Keyless SQL Learning Assistant API",
    version="1.0.0"
)

# Enable CORS for local development when running frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQL engine
sql_engine = get_sql_engine()

@app.on_event("startup")
def startup_event():
    sql_engine.reload()
    logger.info("SQLSense AI Local Knowledge Engine initialized successfully (Keyless Mode).")

@app.get("/health", tags=["System"])
def health_check():
    """
    Checks backend health and reports local engine status.
    """
    return {
        "status": "healthy",
        "engine": "local_sql_knowledge_engine",
        "topics_loaded": len(sql_engine.docs),
        "keyless": True
    }

@app.get("/about", response_model=AboutResponse, tags=["Metadata"])
def get_about():
    """
    Returns app metadata including supported topics list.
    """
    return AboutResponse(
        app_name="SQLSense AI",
        version="1.0.0",
        tagline="Your Intelligent SQL Learning Assistant",
        supported_topics=sql_engine.supported_topic_names or [
            "Create Table", "Insert", "Update", "Delete", "Truncate", "Drop",
            "Select", "Where", "Order By", "Group By", "Having", "Aggregate Functions",
            "Primary Key", "Foreign Key", "Inner Join", "Left Join", "Right Join", 
            "Full Join", "Cross Join", "Self Join", "Union", "Views",
            "Indexes", "Normalization", "Subqueries", "CTE", "Window Functions",
            "Transactions", "Stored Procedures", "Triggers"
        ],
        rag_ready=True
    )

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
def chat_endpoint(request: ChatRequest):
    """
    Processes chat queries using the local SQL knowledge engine.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
        
    logger.info(f"Processing query: '{request.message[:60]}...'")
    reply, source = sql_engine.query(request.message)
    
    return ChatResponse(
        reply=reply,
        context_used=source
    )

# Static file serving for React production build (frontend/dist)
dist_dir = settings.frontend_dist_dir
assets_dir = os.path.join(dist_dir, "assets")

if os.path.isdir(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    logger.info(f"Mounted static assets from: {assets_dir}")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(full_path: str):
    """
    Serves the React frontend SPA build for any non-API route.
    """
    # Exclude API endpoints and OpenAPI documentation
    if full_path in ("health", "about", "chat", "docs", "openapi.json", "redoc"):
        raise HTTPException(status_code=404, detail="Endpoint not found")
        
    # Check if a specific file exists in dist (e.g., favicon.ico, vite.svg)
    file_path = os.path.join(dist_dir, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # Default to index.html for SPA routing
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.isfile(index_file):
        return FileResponse(index_file)
        
    # Fallback message if frontend has not yet been built
    return JSONResponse(
        content={
            "message": "SQLSense AI Backend API is running.",
            "notice": "Frontend build not found at frontend/dist. Run 'npm run build' in frontend/ to build the UI."
        },
        status_code=200
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
