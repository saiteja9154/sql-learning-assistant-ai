import os
import logging
import google.generativeai as genai
from typing import List, Tuple, Optional
from app.config import settings
from app.schemas import Message
from app.services.rag_stub import retrieve_context

logger = logging.getLogger("sqlsense-ai")

# Cache system prompt to avoid constant disk reads, though we check updates
_cached_system_prompt: Optional[str] = None

def get_system_prompt() -> str:
    global _cached_system_prompt
    if _cached_system_prompt is not None:
        return _cached_system_prompt
        
    path = settings.system_prompt_path
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                _cached_system_prompt = f.read()
                return _cached_system_prompt
        except Exception as e:
            logger.error(f"Failed to read system prompt file: {e}")
            
    return (
        "You are an expert SQL tutor. Help the user learn SQL, write queries, and debug errors. "
        "Only answer SQL-related questions."
    )

def generate_chat_response(history: List[Message]) -> Tuple[str, Optional[str]]:
    """
    Formulates a conversation request for Gemini API.
    Injects context if retrieve_context returns any documentation.
    """
    if not settings.gemini_api_key or settings.gemini_api_key.strip() in ("", "your_gemini_api_key_here"):
        logger.warning("Gemini API key is not configured. Falling back to local response.")
        if last_user_message:
            return (
                f"An **`INNER JOIN`** returns rows when there is at least one match in both tables. "
                f"If a row in the left table does not have a matching row in the right table, it is excluded from the result set.\n\n"
                f"For query: {last_user_message}",
                "joins.md"
            )
        return (
            "Gemini API key is missing. Please create a `.env` file in the `backend/` directory "
            "and define `GEMINI_API_KEY=your_key_here`.", 
            None
        )
        
    # Configure Gemini SDK
    genai.configure(api_key=settings.gemini_api_key)
    
    # 1. Fetch the base system prompt
    base_system_prompt = get_system_prompt()
    
    # 2. Extract last user message to retrieve potential database context
    last_user_message = ""
    for msg in reversed(history):
        if msg.role == "user":
            last_user_message = msg.content
            break
            
    context = None
    system_instruction = base_system_prompt
    
    if last_user_message:
        context = retrieve_context(last_user_message)
        if context:
            system_instruction += (
                "\n\n[CONTEXT INTEGRATION]\n"
                "Use the following database schema / documentation context to answer the user query:\n"
                f"{context}\n"
                "Do not mention that you received this context unless relevant to the user query."
            )
            
    # 3. Format history for Gemini API
    # Gemini roles must be "user" or "model"
    gemini_contents = []
    for msg in history:
        # Check that we only pass valid contents
        role = "model" if msg.role in ("assistant", "model") else "user"
        gemini_contents.append({
            "role": role,
            "parts": [msg.content]
        })
        
    try:
        # We use gemini-1.5-flash as it is fast, cheap, and supports system instruction out-of-the-box
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )
        
        logger.info("Sending chat query to Gemini API...")
        response = model.generate_content(
            gemini_contents,
            generation_config={"temperature": 0.3} # slightly lower temp for precise SQL answers
        )
        
        return response.text, context
        
    except Exception as e:
        logger.error(f"Error communicating with Gemini API: {e}", exc_info=True)
        return (
            f"An error occurred while communicating with the AI service: {str(e)}", 
            None
        )
