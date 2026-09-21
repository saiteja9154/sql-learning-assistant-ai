# SQLSense AI 🚀

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)
[![Keyless](https://img.shields.io/badge/API_Keys-None_Required-success?style=for-the-badge)](https://github.com/saiteja9154/sql-learning-assistant-ai)

> **Your Intelligent, Keyless SQL Learning Assistant**  
> Built with a high-speed local SQL Knowledge Engine, FastAPI backend, and modern mobile-first React frontend.

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

## 📁 Repository Structure

```
sql-learning-assistant-ai/
├── backend/                  # FastAPI backend service & engine
│   ├── app/
│   │   ├── services/         # SQL topics & retrieval logic
│   │   ├── config.py         # App configuration & paths
│   │   ├── main.py           # FastAPI endpoints & CORS
│   │   └── schemas.py        # Pydantic request/response models
│   ├── .env.example          # Environment variables template
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React + Vite + Tailwind frontend SPA
│   ├── public/               # SVGs, favicon & icons
│   ├── src/                  # React components & UI logic
│   ├── index.html            # SPA entry point
│   ├── package.json          # Node dependencies
│   ├── vercel.json           # Vercel SPA rewrite rules
│   └── vite.config.js        # Vite bundler config
├── knowledge/                # 27+ Curated SQL Knowledge Markdown files
│   ├── joins.md
│   ├── windowfunctions.md
│   ├── transactions.md
│   └── ...
├── docs/                     # Comprehensive system documentation
│   ├── architecture.md
│   ├── api.md
│   ├── backend.md
│   ├── frontend.md
│   ├── rag.md
│   └── prompt_engineering.md
├── assets/                   # Architecture diagrams & media
├── prompts/                  # System prompts & scripts
├── render.yaml               # Render Blueprint deployment config
└── README.md                 # Project documentation
```

---

## ✨ Features
1. **Curated In-Memory Knowledge Base**: Indexes 27 structured SQL markdown files covering topics from basic CRUD filters to CTEs, Views, Indexes, Transactions, and Triggers.
2. **Keyless & Self-Contained**: 100% operational out of the box — no OpenAI, Gemini, or external API keys needed.
3. **High-Speed Topic Retrieval**: Instant semantic phrase and keyword matching engine.
4. **Authentic Chatbot UI**: Mobile-first right/left speech bubbles, floating input capsule, auto-growing textarea, and dark mode design system.
5. **Sidebar Query History**: Collapsible navigation drawer saving recent queries to LocalStorage.
6. **SQL Query Formatter**: Pure JavaScript SQL formatter with keyword capitalization and indentation.
7. **Interactive Quiz Mode**: Multi-choice quiz with difficulty filtering, instant grading, and explanations.
8. **SQL Coding Practice Console**: Practice table schema and query execution sandbox.

---

## 🚀 Quick Start (Local)

### 1. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Run the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Open in Browser
Open [http://localhost:5173](http://localhost:5173) for frontend dev server or [http://localhost:8000](http://localhost:8000) for backend API.

---

## 🌐 Deploying to Cloud

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable: `VITE_API_URL` = `https://<your-render-backend-url>.onrender.com`.
4. Click **Deploy**.

### Backend (Render)
1. Create a Web Service on [Render](https://render.com).
2. **Build Command**: `pip install -r backend/requirements.txt`
3. **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set `PYTHON_VERSION` to `3.12.8`.
