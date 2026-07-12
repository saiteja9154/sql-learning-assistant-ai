# SQLSense AI 🚀

[![RAG Active](https://img.shields.io/badge/RAG-Active-blueviolet?style=for-the-badge)](https://github.com/steja/sqlsense-ai)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

> **Your Intelligent SQL Learning Assistant with Production-Grade RAG Ingestion**  
> Built as a selection task submission for the K-Hub Senior Developer Intern role.

---

## 🖼️ Project Banner
```
  ____   ___  _     ____                               _      ___ 
 / ___| / _ \| |   / ___|  ___ _ __  ___  ___    /\   | |    |_ _|
 \___ \| | | | |   \___ \ / _ \ '_ \/ __|/ _ \  /  \  | |     | | 
  ___) | |_| | |___ ___) |  __/ | | \__ \  __/ / /\ \ | |___  | | 
 |____/ \__\_\_____|____/ \___|_| |_|___/\___|/_/  \_\_____||___|
                                                                  
                 YOUR INTELLIGENT SQL TUTOR
```

---

## 📝 Project Description

**SQLSense AI** is an open-source, domain-specific AI tutor designed to help developers and students master SQL queries, study relational database systems, and prepare for technical interviews. 

Unlike general-purpose conversational LLMs that are prone to hallucinating syntactically invalid queries, SQLSense AI implements a local **Retrieval-Augmented Generation (RAG)** pipeline. Every question asked is checked against a curated offline SQL knowledge base, and responses are grounded in verified documentation containing practical examples, syntax structures, common pitfalls, performance tips, and interview advice.

The chatbot strictly enforces topic boundaries: it only answers database-related questions and politely rejects unrelated coding or chat prompts.

---

## 📸 Screenshots Placeholder
```
+---------------------------------------------------------------------------------+
|                                 SQLSense AI UI                                  |
| +------------------+----------------------------------------------------------+ |
| |  [SQLSense Tools]|  SQLSense AI                                        Info | |
| |                  |  Your Intelligent SQL Learning Assistant                 | |
| |  [+] New Chat    |                                                          | |
| |  [ ] Formatter   |  [ Explain INNER JOIN ]   [ WHERE vs HAVING ]            | |
| |  [ ] Practice    |  [ Second Salary      ]   [ Window Functions]            | |
| |  [ ] Quiz Mode   |                                                          | |
| |                  |  [ Ask a SQL question...                          ] [Send] | |
| +------------------+----------------------------------------------------------+ |
+---------------------------------------------------------------------------------+
```

---

## ✨ Features
1. **Curated In-Memory Knowledge Base**: Indexes 27 structured SQL markdown files covering topics from basic CRUD filters to CTEs, Views, Indexes, Transactions, and Triggers.
2. **Local Vector Storage (ChromaDB)**: Embeds source files locally using Sentence Transformers (`all-MiniLM-L6-v2`) and caches them under `backend/db/chroma/` for instant startup speeds.
3. **Strict Domain Guardrails**: Enforces that all responses relate only to databases. Non-database prompts are rejected, and queries not answered in the local context trigger a safe fallback warning: *"I couldn't find sufficient information in my SQL knowledge base."*
4. **Markdown Tables & Code Formatting**: Beautiful styling representing query output tables, syntax highlighting, and an instant "Copy SQL" button.
5. **Sidebar Query History**: COLLAPSIBLE Left Navigation Panel that saves recent queries to LocalStorage, allowing users to re-execute them with one click.
6. **SQL Query Formatter**: Pure JavaScript regex SQL formatter that capitalizes keywords and structures query indents inside the browser client.
7. **Interactive Quiz Mode**: A 5-question multi-choice test checking core SQL concepts with instant grading, scoring, and educational reviews.
8. **SQL Coding Console**: Offers a sandbox environment representing an Employees table schema, validating user-written queries with real-time feedback.
9. **Chat Log Exporter**: Exports the current conversation as a formatted `.txt` file.

---

## 🏗️ System Architecture & RAG Workflow

```
               +-------------------------------------------------+
               |              React SPA (Vite)                   |
               |  (Formatter, Quiz Modals, Sidebar Query Logs)   |
               +-------------------------------------------------+
                                       ||
                                       || POST /chat
                                       \/
               +-------------------------------------------------+
               |               FastAPI App (main.py)             |
               +-------------------------------------------------+
                                       ||
                                       || Ingest / Search
                                       \/
               +-------------------------------------------------+
               |             ChromaDB Vector Store               |
               | (Metadata filenames extraction: joins.md, etc.) |
               +-------------------------------------------------+
                                       ||
                                       || Formulate System Prompt
                                       \/
               +-------------------------------------------------+
               |               Google Gemini API                 |
               |    (gemini-1.5-flash with low temperature)     |
               +-------------------------------------------------+
```

### How RAG Works
1. **Indexing**: On startup, `vectordb.py` loads the files in `knowledge/`, splits them (size 600, overlap 100), embeds them, and saves the vectors locally.
2. **Retrieval**: The retriever extracts the top 3 most relevant chunks based on cosine similarity.
3. **Formulation**: The context chunks are merged into a strict system instruction template.
4. **Generation**: Gemini processes the context, chat history, and prompt to construct the reply.
5. **Citations**: The backend returns the list of source files (e.g. `joins.md`, `cte.md`) which are automatically rendered as clickable pill-cards at the bottom.

---

## 📂 Folder Structure
See the developer documentation inside [docs/architecture.md](docs/architecture.md) for details on the files layout.

---

## 🚀 Installation & Setup

### Prerequisites
* Python 3.9+
* Node.js 18+
* Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### 1. Backend Ingestion & Execution
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup environment variables:
   * Create a `.env` file containing:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     PORT=8000
     HOST=0.0.0.0
     ```
5. **Ingest and build the index**:
   ```bash
   python verify_rag.py
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

### 2. Frontend Execution
1. Open a second terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at the local link printed (typically **http://localhost:5173**).

---

## 💡 Key Design Trade-offs

| Design Decision | Pros | Cons | Alternate Option |
|-----------------|------|------|------------------|
| **Local ChromaDB** | 100% free, fast, zero network overhead during searches, simple setup. | Stores index files locally, meaning they must be rebuilt if deployment is stateless. | Pinecone or pgvector |
| **Local Embeddings** | Completely free, no token usage limits, runs offline, fast. | Memory footprint is larger during indexing; requires downloading the transformer model. | OpenAI / Gemini Embeddings API |
| **Inline File citations** | Reuses ReactMarkdown components directly without complicating API responses. | Requires filenames to end with `.md` to trigger citation formatting. | Structured JSON schemas |

---

## 📖 Developer Documentation
Explore the `docs/` folder to view detailed specifications:
* [docs/architecture.md](docs/architecture.md) — System designs and flow charts.
* [docs/api.md](docs/api.md) — Rest routes schemas.
* [docs/rag.md](docs/rag.md) — Vector indexing configurations.
* [docs/prompt_engineering.md](docs/prompt_engineering.md) — Prompts and guardrails rules.
* [docs/frontend.md](docs/frontend.md) — Frontend components architecture.
* [docs/backend.md](docs/backend.md) — Backend packages layout.

---

## 📄 Demo Instructions
1. Run the servers and open the UI at `http://localhost:5173`.
2. Ask out-of-scope questions (e.g. *Write a python script to check files*) to verify that SQLSense AI rejects the request.
3. Query a topic from the quick cards (e.g. *Explain CTE*) to verify the formatted markdown syntax, output tables, and citation pills at the bottom.
4. Try out the SQL Formatter, Quiz, and Practice consoles.

---

## 🤝 Contribution & License
Contributions are welcome. Please fork the repository, make changes in a separate feature branch, and submit a pull request.
* **Author**: Steja (Selection Task Candidate)
* **License**: MIT
