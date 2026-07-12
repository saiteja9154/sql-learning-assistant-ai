import os
import logging
from langchain_community.vectorstores import Chroma
from rag.loader import load_knowledge_docs
from rag.splitter import split_documents
from rag.embeddings import get_embeddings_model

logger = logging.getLogger("sqlsense-ai")

# Resolve absolute paths dynamically
RAG_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(RAG_DIR)
ROOT_DIR = os.path.dirname(BACKEND_DIR)

KNOWLEDGE_DIR = os.path.join(ROOT_DIR, "knowledge")
DB_DIR = os.path.join(BACKEND_DIR, "db", "chroma")

_vector_store = None

def get_vector_db() -> Chroma:
    """
    Initializes and returns the Chroma Vector DB instance.
    Reuses existing vectors on disk or builds them from scratch on startup.
    """
    global _vector_store
    if _vector_store is not None:
        return _vector_store

    embeddings = get_embeddings_model()
    
    # Check if DB directory exists and contains files
    db_exists = False
    if os.path.exists(DB_DIR):
        files = os.listdir(DB_DIR)
        if len(files) > 0:
            db_exists = True

    if db_exists:
        logger.info(f"Reusing existing Chroma vector store from disk at: {DB_DIR}")
        _vector_store = Chroma(
            persist_directory=DB_DIR,
            embedding_function=embeddings
        )
    else:
        logger.info("Chroma vector store not found on disk. Building vector database from knowledge files...")
        try:
            # 1. Load documents
            if not os.path.exists(KNOWLEDGE_DIR):
                logger.error(f"Knowledge folder missing: {KNOWLEDGE_DIR}")
                raise FileNotFoundError(f"Knowledge folder missing: {KNOWLEDGE_DIR}")
                
            docs = load_knowledge_docs(KNOWLEDGE_DIR)
            if not docs:
                raise ValueError(f"No markdown documents found in knowledge directory: {KNOWLEDGE_DIR}")
            
            # 2. Split documents
            chunks = split_documents(docs)
            logger.info(f"Loaded {len(docs)} documents. Split into {len(chunks)} chunks.")
            
            # 3. Create and persist vector store
            os.makedirs(DB_DIR, exist_ok=True)
            _vector_store = Chroma.from_documents(
                documents=chunks,
                embedding=embeddings,
                persist_directory=DB_DIR
            )
            logger.info("Chroma vector store built and saved to disk successfully.")
        except Exception as e:
            logger.error(f"Error building vector database: {str(e)}", exc_info=True)
            raise e
            
    return _vector_store
