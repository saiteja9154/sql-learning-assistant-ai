import os
from typing import List
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_core.documents import Document

def load_knowledge_docs(knowledge_dir: str) -> List[Document]:
    """
    Loads all markdown files inside the knowledge directory using DirectoryLoader.
    """
    if not os.path.exists(knowledge_dir):
        raise FileNotFoundError(f"Knowledge directory not found at: {knowledge_dir}")
        
    # We use TextLoader with utf-8 encoding as loader class to parse markdown text safely
    loader = DirectoryLoader(
        knowledge_dir,
        glob="*.md",
        loader_cls=TextLoader,
        loader_kwargs={'encoding': 'utf-8'}
    )
    
    return loader.load()
