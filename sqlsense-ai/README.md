# SQLSense AI 🚀

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Keyless](https://img.shields.io/badge/API_Keys-None_Required-success?style=for-the-badge)](https://github.com/saiteja9154/sql-learning-assistant-ai)

> **Your Intelligent, Keyless SQL Learning Assistant**  
> Built with a high-speed local SQL Knowledge Engine, FastAPI backend, and modern React frontend.

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

**SQLSense AI** is a domain-specific SQL learning assistant designed to help developers and students master SQL queries, study relational database systems, and prepare for technical interviews.

Unlike complex external AI dependencies that require fragile API keys, credit cards, or rate-limited cloud services, SQLSense AI features a **Local SQL Knowledge Engine**. Every question asked is matched against a curated offline SQL knowledge base of 27 comprehensive topics. Responses provide verified documentation containing practical examples, syntax structures, common pitfalls, performance tips, and interview advice with zero external API dependencies.

---

## ✨ Features
1. **Curated In-Memory Knowledge Base**: Indexes 27 structured SQL markdown files covering topics from basic CRUD filters to CTEs, Views, Indexes, Transactions, and Triggers.
2. **Keyless & Self-Contained**: 100% operational out of the box — no OpenAI, Gemini, or external API keys needed.
3. **High-Speed Topic Retrieval**: Instant semantic phrase and keyword matching engine.
4. **Structured Markdown Responses**: Beautiful styling for query code blocks, syntax highlighting, outputs, mistakes, and interview tips.
5. **Sidebar Query History**: Collapsible left navigation panel saving recent queries to LocalStorage.
6. **SQL Query Formatter**: Pure JavaScript SQL formatter with keyword capitalization and indentation.
7. **Interactive Quiz Mode**: 5-question multi-choice quiz with instant grading and explanations.
8. **SQL Coding Practice Console**: Practice table schema and query execution sandbox.
9. **Single-URL Deployment**: FastAPI serves both the REST API and the React production build seamlessly.

---

## 🏗️ System Architecture

```
                USER
                  │
                  ▼
          ┌───────────────┐
          │ React Frontend│
          └───────┬───────┘
                  │
                  │ /chat
                  ▼
          ┌───────────────┐
          │    FastAPI    │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │  SQL Engine   │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Local SQL KB  │
          │ 27 .md files  │
          └───────┬───────┘
                  │
                  ▼
              RESPONSE
```

---

## 🚀 Quick Start (Local)

### 1. Build the Frontend
```bash
cd sqlsense-ai/frontend
npm install
npm run build
```

### 2. Run the Backend
```bash
cd ../backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Open in Browser
Open [http://localhost:8000](http://localhost:8000) to access the complete application.

---

## 🌐 Deploy to Render

### Option A: Using Render Blueprint (Recommended)
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a **Blueprint Instance**. Render will automatically detect `render.yaml` in the repository root.
3. Click **Apply** to deploy!

### Option B: Manual Web Service Setup
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Set **Root Directory** to:
   ```text
   sqlsense-ai
   ```
4. Set **Runtime** to `Python 3` (Python 3.12).
5. Set **Build Command**:
   ```bash
   npm --prefix frontend install && npm --prefix frontend run build && pip install -r backend/requirements.txt
   ```
6. Set **Start Command**:
   ```bash
   cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
7. **Environment Variables**:
   * `PYTHON_VERSION`: `3.12.8`

