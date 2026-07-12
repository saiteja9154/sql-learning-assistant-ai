# Backend Documentation

This document describes the structure and operations of the FastAPI backend of **SQLSense AI**.

---

## 📂 Core Structure

The backend application is managed inside the `backend/` directory.

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # App settings & environment loaders
│   ├── main.py            # FastAPI main application & CORS routes
│   └── schemas.py         # Request and Response validation schemas
├── db/
│   └── chroma/            # Persistent ChromaDB vector index directories
├── rag/
│   ├── __init__.py
│   ├── loader.py          # Document loader utilizing DirectoryLoader
│   ├── splitter.py        # Text chunk splitter (RecursiveCharacterTextSplitter)
│   ├── embeddings.py      # HuggingFace Embeddings initialization
│   ├── vectordb.py        # Database creation and mount managers
│   ├── retriever.py       # Queries vectors similarity database
│   ├── prompt.py          # Template formatting
│   ├── chain.py           # Ingestion pipelines and Gemini orchestration
│   └── chat.py            # Intercepts REST routes, formats replies & sources
├── requirements.txt       # Backend dependencies
└── verify_rag.py          # Verification script for index seeding
```

---

## ⚙️ App Configurations & Setup

* **Framework**: FastAPI + Uvicorn server running on `http://localhost:8000`.
* **Configuration manager**: `pydantic-settings` constructs system configurations.
  * Reads `.env` from the backend directory.
  * Environment variables required: `GEMINI_API_KEY`, `PORT`, `HOST`.
* **CORS Policy**: Configured in `main.py` allowing access requests from any origin (`*`) to facilitate Vite's development server port queries (`http://localhost:5173`).

---

## 📡 Chat Endpoint Processing

When requests hit the `POST /chat` endpoint:
1. **Pydantic Validation**: Checks incoming request payloads against the `ChatRequest` model.
2. **Path Resolution**: Dynamically appends backend paths to Python's system path, preventing routing failures when run outside root folders.
3. **Ingestion Checks**: Checks if Chroma database has cached files under `backend/db/chroma/`. If not, triggers the RAG ingestion pipeline (loading and parsing markdown files under `knowledge/`).
4. **Context Retrieval**: Queries Chroma using the user's latest message, extracting the top 3 matching text chunks.
5. **Generation**: Submits context and system prompt instructions along with message histories to the `gemini-1.5-flash` model.
6. **Sources & Output Formatter**: Pulls document source metadata, matches them, and compiles final answers.
