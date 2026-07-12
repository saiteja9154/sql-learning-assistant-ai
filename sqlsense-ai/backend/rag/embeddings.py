from langchain_community.embeddings import HuggingFaceEmbeddings

def get_embeddings_model() -> HuggingFaceEmbeddings:
    """
    Returns the HuggingFace all-MiniLM-L6-v2 embedding model wrapper.
    """
    # Uses sentence-transformers locally with a 384-dimension vector space
    return HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        encode_kwargs={"normalize_embeddings": True}
    )
