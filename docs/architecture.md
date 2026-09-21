# System Architecture Documentation

This document describes the high-level system architecture of **SQLSense AI**, illustrating the data flows and integration layers between the React SPA, FastAPI backend, local Chroma vector database, and the Google Gemini API.

---

## 🏗️ Architectural Overview

SQLSense AI uses a modern, detached client-server model (Frontend-Backend separation) with a local Retrieval-Augmented Generation (RAG) vector store.

```
+------------------+         REST API / JSON         +-------------------+
|  React Frontend  | <=============================> |  FastAPI Backend  |
|  (Vite Server)   |                                 | (Uvicorn Server)  |
+------------------+                                 +-------------------+
                                                              ||
                                                 Query /      || Generate Response /
                                                 Context      || System Instruction
                                                              \/
                                                    +--------------------+
                                                    |  Local Vector DB   |
                                                    |     (ChromaDB)     |
                                                    +--------------------+
                                                              ||
                                                              || REST / SDK
                                                              \/
                                                    +--------------------+
                                                    |   Google Gemini    |
                                                    |      LLM API       |
                                                    +--------------------+
```

---

## 🛠️ Components Breakdown

### 1. Presentation Layer (React Frontend)
* **Build tool**: Vite + React
* **Styling**: Tailwind CSS (v4) + HSL Glassmorphism utility classes
* **Animations**: Framer Motion transitions
* **State Routing**: Singe Page Application (SPA) tracking chat arrays, history sidebar, SQL Formatter, Quiz, and coding challenges.
* **Network client**: Native `fetch` API making async calls to FastAPI on `http://localhost:8000`.

### 2. Service Layer (FastAPI Backend)
* **Framework**: FastAPI (Python 3)
* **Server**: Uvicorn
* **Configuration**: Pydantic Settings reading `.env` variables.
* **Middlewares**: CORS middleware enabling connection access from Vite.

### 3. RAG Storage Layer (ChromaDB)
* **Embedding Model**: `all-MiniLM-L6-v2` run locally via `SentenceTransformers` (384-dimensional dense vectors).
* **Storage Provider**: ChromaDB (locally persisted under `backend/db/chroma`).
* **Ingestion Pipeline**: LangChain `DirectoryLoader` reads 27 markdown files, divides them using `RecursiveCharacterTextSplitter` (600 characters size, 100 overlap), embeds them, and caches index files.

### 4. Language Model (Gemini LLM)
* **Model version**: `gemini-1.5-flash`
* **Temperature**: `0.1` (low temperature to enforce strict grounding on retrieved documentation context).
* **Role**: Formulates structured, educational tutoring responses.

---

## 🔄 RAG Workflow Dataflow
1. **Submit**: User types an SQL query (e.g. *What is a window function?*) and clicks Send.
2. **REST Call**: React issues a `POST /chat` with the message list payload.
3. **Retrieval**: FastAPI intercepts the message, extracts the latest query, converts it to a 384-dimension vector, and runs similarity search against the local ChromaDB.
4. **Context Gathering**: ChromaDB returns the top 3 most relevant documentation text chunks.
5. **Prompt Injection**: The backend merges the system instructions, conversation logs, and the 3 chunks into a single prompt.
6. **LLM Generation**: The prompt is processed by Gemini, which compiles a structured answer (Explanation, Syntax, Example, Mistake, Interview Tip, etc.).
7. **Citations**: The backend identifies which file sources (`windowfunctions.md`) were read, lists them at the bottom, and returns the response block.
