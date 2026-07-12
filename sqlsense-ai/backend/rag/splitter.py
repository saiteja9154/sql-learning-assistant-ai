from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def split_documents(
    docs: List[Document], 
    chunk_size: int = 600, 
    chunk_overlap: int = 100
) -> List[Document]:
    """
    Splits documents into smaller text chunks for vector embedding.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        add_start_index=True
    )
    
    return text_splitter.split_documents(docs)
