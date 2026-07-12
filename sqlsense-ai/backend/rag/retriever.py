from typing import List
from langchain_core.documents import Document
from rag.vectordb import get_vector_db

def retrieve_relevant_chunks(query: str, k: int = 3) -> List[Document]:
    """
    Queries the vector database for the top k matching chunks based on the input query.
    """
    db = get_vector_db()
    # Perform similarity search for semantic match
    return db.similarity_search(query, k=k)
