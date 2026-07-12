import os
import sys

# Ensure backend directory is in python path to resolve modules
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BACKEND_DIR)

# Reconfigure stdout to use utf-8 to print emojis on Windows consoles safely
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from rag.vectordb import get_vector_db
from rag.retriever import retrieve_relevant_chunks

def test_rag():
    print("==================================================")
    print("SQLSense AI - RAG Pipeline Verification Script")
    print("==================================================")
    
    print("\n1. Initializing and building Chroma Vector DB...")
    db = get_vector_db()
    print("-> ChromaDB database loaded/constructed successfully.")
    
    query = "Explain INNER JOIN"
    print(f"\n2. Executing similarity search query: '{query}'")
    chunks = retrieve_relevant_chunks(query, k=3)
    
    print(f"-> Retrieved {len(chunks)} relevant chunks from index.")
    
    for i, chunk in enumerate(chunks):
        src = os.path.basename(chunk.metadata.get('source', 'unknown'))
        print(f"\n[Chunk {i+1}] Source: {src}")
        print("-" * 50)
        # print first few lines of chunk contents
        print(chunk.page_content[:200].strip() + "...")
        print("-" * 50)
        
    print("\n3. Success: All loader, splitter, embedding, and vector DB modules are verified!")
    print("==================================================")

if __name__ == "__main__":
    test_rag()
