import logging
from app.schemas import ChatRequest, ChatResponse
from rag.chain import execute_rag_chain

logger = logging.getLogger("sqlsense-ai")

def process_chat_message(request: ChatRequest) -> ChatResponse:
    """
    Processes a chat request through the RAG chain and builds the API response.
    """
    logger.info("Processing incoming chat request in RAG controller...")
    
    reply, sources = execute_rag_chain(request.message)
    
    # Enforce that sources are visible in the markdown text.
    # If the Gemini LLM forgot to list them, we append them programmatically
    # to maintain strict UI conformity with the required template.
    if sources:
        # Check if the model has already rendered a Sources section
        has_sources_section = any(
            header in reply for header in ["Sources", "### 📄 Sources", "📄 Sources"]
        )
        if not has_sources_section and "I couldn't find sufficient information" not in reply:
            sources_markdown = "\n\n### 📄 Sources\n" + "\n".join([f"- `{src}`" for src in sources])
            reply += sources_markdown
            logger.info(f"Programmatically appended {len(sources)} sources to RAG answer.")
            
    # Set context_used metadata in the API response
    context_used = ", ".join(sources) if sources else None
    
    return ChatResponse(
        reply=reply,
        context_used=context_used
    )
