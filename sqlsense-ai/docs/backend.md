# Backend Documentation

This document describes the structure and operations of the FastAPI backend of **SQLSense AI**.

---

## 📂 Core Structure

The backend application is managed inside the `backend/` directory.

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # App settings & directory path resolvers
│   ├── main.py            # FastAPI main application, CORS & SPA static routes
│   ├── schemas.py         # Request and Response Pydantic schemas
│   └── services/
│       ├── __init__.py
│       ├── sql_engine.py  # Local SQL Knowledge & matching engine
│       └── sql_topics.py  # SQL topic catalogs & quiz question banks
├── requirements.txt       # Backend dependencies (FastAPI, Uvicorn, Pydantic)
└── .env.example           # Example environment file
```

---

## ⚙️ App Configurations & Setup

* **Framework**: FastAPI + Uvicorn server running on `http://localhost:8000` (or `$PORT` on Render).
* **Configuration manager**: `pydantic-settings` constructs system configurations.
  * Reads `.env` from the backend directory (or injected environment variables).
  * Optional Environment variables: `PORT` (defaults to 8000), `HOST` (defaults to 0.0.0.0).
  * No external API keys (OpenAI / Gemini) required.
* **CORS Policy**: Configured in `main.py` allowing access requests from any origin (`*`) to facilitate Vite development server queries (`http://localhost:5173`).
* **SPA Serving**: In production, `main.py` automatically mounts and serves the React build output (`frontend/dist`) on root routes.

---

## 📡 Endpoints Overview

1. **`GET /health`**: Returns system health, loaded topics count, and keyless mode status.
2. **`GET /about`**: Returns application metadata and the list of supported SQL topics.
3. **`POST /chat`**: Receives `{"message": "..."}`, searches the local SQL knowledge base (27 indexed markdown files), and returns structured explanations, syntax, practical examples, and source references.
4. **`GET /quiz`**: Returns difficulty-filtered SQL quiz questions (`beginner`, `intermediate`, `advanced`) with options and explanations.
5. **`GET /{full_path}`**: Serves static files and React single-page application (SPA).
