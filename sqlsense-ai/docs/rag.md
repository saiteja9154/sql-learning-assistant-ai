# Retrieval-Augmented Generation (RAG) Documentation

This document describes the design, ingestion workflow, and query retrieval pipelines of the **RAG** engine inside **SQLSense AI**.

---

## 🚀 RAG Architecture & Ingestion Flow

The ingestion pipeline converts the Markdown files under `knowledge/` into dense semantic vector representations and persists them inside ChromaDB.

```
+--------------------+
| 27 Markdown Files  | (Raw SQL concepts, syntax, mistakes)
+--------------------+
          ||
          || LangChain DirectoryLoader + TextLoader
          \/
+--------------------+
| LangChain Documents| (UTF-8 Encoded files)
+--------------------+
          ||
          || RecursiveCharacterTextSplitter (chunk: 600, overlap: 100)
          \/
+--------------------+
| Document Chunks    | (Adds start indices and page references)
+--------------------+
          ||
          || Hugging Face Embeddings (all-MiniLM-L6-v2)
          \/
+--------------------+
| 384-Dim Vectors    | (Dense vector spaces)
+--------------------+
          ||
          || Persist
          \/
+--------------------+
|     ChromaDB       | (Cached locally under backend/db/chroma/)
+--------------------+
```

---

## 🛠️ Modules Breakdown

### 1. Ingestion Pipeline (`rag/loader.py`, `rag/splitter.py`)
* **Loader**: `DirectoryLoader` targets `sqlsense-ai/knowledge/`. It searches for files matching `*.md` and loads them recursively using `TextLoader` with UTF-8 encoding.
* **Splitter**: `RecursiveCharacterTextSplitter` chunking splits documents recursively by characters (e.g. paragraph breaks, double newlines).
  * `chunk_size = 600`
  * `chunk_overlap = 100`

### 2. Embeddings Model (`rag/embeddings.py`)
* Uses `HuggingFaceEmbeddings` referencing the sentence-transformers model `all-MiniLM-L6-v2`.
* Executes 100% locally in-memory, producing 384-dimensional dense vectors.
* Cosine similarity is configured to optimize vector comparisons.

### 3. Vector Database Indexing (`rag/vectordb.py`)
* Uses **Chroma** as the vector database.
* Data is stored on disk under `backend/db/chroma/`.
* **Startup optimization**: On startup, it checks if `backend/db/chroma/` exists and contains database files. If it exists, it mounts the DB instantly, avoiding parsing/embedding latency.

### 4. Query Retrieval (`rag/retriever.py`)
* Issues a `similarity_search` against the Chroma collection.
* Parametrized to return the top 3 (`k=3`) matching chunks.
* Incorporates metadata sources mapping (each chunk has metadata referencing its original file name).

### 5. API Orchestration (`rag/chain.py`, `rag/chat.py`)
* Extracts the metadata `source` path from the retrieved chunks.
* Extracts the filename using `os.path.basename(path)` to compile the sources list (e.g., `joins.md`, `cte.md`).
* Merges the query with the RAG prompt system instructions and conversation logs.
