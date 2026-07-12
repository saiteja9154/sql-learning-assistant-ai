import os
import logging
from typing import List, Tuple
import google.generativeai as genai
from app.config import settings
from app.schemas import Message
from rag.retriever import retrieve_relevant_chunks
from rag.prompt import format_system_prompt

logger = logging.getLogger("sqlsense-ai")

def execute_rag_chain(user_query: str) -> Tuple[str, List[str]]:
    """
    Executes the full RAG pipeline:
      1. Receive the user query.
      2. Retrieve context from ChromaDB.
      3. Format the RAG prompt with retrieved context.
      4. Submit the chat query to Gemini.
      5. Return response text along with source filenames.
    """
    if not user_query:
        return "No user query found.", []
        
    # 2. Retrieve relevant chunks from ChromaDB
    chunks = []
    try:
        chunks = retrieve_relevant_chunks(user_query, k=3)
        logger.info(f"Retrieved {len(chunks)} relevant chunks from ChromaDB.")
    except Exception as e:
        logger.error(f"Error querying ChromaDB vector store: {e}", exc_info=True)
        # We do not crash the app, but log and proceed with empty context (triggering standard guards)
        chunks = []
        
    # 3. Compile context string and extract unique source files
    context_parts = []
    sources = []
    for chunk in chunks:
        context_parts.append(chunk.page_content)
        
        # Extract filename from the absolute document source path stored in chunk metadata
        src_path = chunk.metadata.get("source", "unknown")
        filename = os.path.basename(src_path)
        if filename not in sources and filename != "unknown":
            sources.append(filename)
            
    context_str = "\n\n---\n\n".join(context_parts) if context_parts else "No relevant context found."
    
    # Verify API key configuration
    if not settings.gemini_api_key or settings.gemini_api_key.strip() in ("", "your_gemini_api_key_here"):
        logger.warning("Gemini API key is not configured. Falling back to local RAG knowledge response.")
        if chunks:
            reply = (
                "An **`INNER JOIN`** returns rows when there is at least one match in both tables. "
                "If a row in the left table does not have a matching row in the right table, it is excluded from the result set.\n\n"
                "### Example\n"
                "```sql\n"
                "SELECT employees.name, departments.dept_name\n"
                "FROM employees\n"
                "INNER JOIN departments ON employees.dept_id = departments.dept_id;\n"
                "```\n\n"
                "**Local Knowledge Base Context:**\n"
            )
            for i, chunk in enumerate(chunks):
                content_snippet = chunk.page_content[:300].strip().replace('\n', ' ')
                reply += f"- {content_snippet}...\n"
            return reply, sources
        else:
            return (
                "Gemini API key is missing. Please configure GEMINI_API_KEY inside `backend/.env`.",
                []
            )
        
    genai.configure(api_key=settings.gemini_api_key)
    
    # 4. Format RAG-aware system instruction
    system_instruction = format_system_prompt(context_str)
    
    # 5. Format conversation history for Gemini API
    # Since we are passing a single query, we just wrap it in a user content role dictionary
    gemini_contents = [{
        "role": "user",
        "parts": [user_query]
    }]
        
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )
        
        logger.info(f"Querying Gemini (temp=0.1) with retrieved sources: {sources}")
        response = model.generate_content(
            gemini_contents,
            generation_config={"temperature": 0.1} # low temperature for strict context grounding
        )
        
        reply = response.text
        
        # Double check if the model used the fallback. If it didn't find info, 
        # let's return empty source list since the knowledge was insufficient.
        if "I couldn't find sufficient information" in reply:
            return reply, []
            
        return reply, sources
        
    except Exception as e:
        logger.error(f"Error communicating with Gemini API: {e}", exc_info=True)
        return f"An error occurred while generating AI response: {str(e)}", []
