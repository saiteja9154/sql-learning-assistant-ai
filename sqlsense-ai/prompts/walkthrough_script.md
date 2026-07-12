# Video Walkthrough Script - SQLSense AI
> **A 3-5 Minute Script for Staging and Demonstrating the Project during Internship Interviews**

This script is structured into chronological sections to guide you through explaining the tech stack, local vector store mechanics, system prompts, challenges faced, and live capabilities.

---

## ⏱️ Timeline & Chapters Outline
1. **0:00 - 0:45**: Introduction & Product Concept
2. **0:45 - 1:30**: Technical Architecture & Modular Layout
3. **1:30 - 2:30**: Live Demo (SQL Formatter, Quiz, Practice, and Chat experience)
4. **2:30 - 3:30**: Under the Hood (ChromaDB + Local Embeddings pipeline)
5. **3:30 - 4:15**: Engineering Challenges & Solutions
6. **4:15 - 5:00**: Future Scope & Wrap-up

---

## 🎙️ Spoken Script

### 🎬 Chapter 1: Introduction & Product Concept (0:00 - 0:45)
* **Visual**: Show the SQLSense AI Homepage landing screen in full dark mode. Toggle the Left Sidebar open and closed once, showing the "Recent Questions" list.
* **Speaker**:  
  > *"Hello everyone! Today I am presenting **SQLSense AI**, an intelligent SQL learning assistant designed as a premium SaaS application rather than a basic student prototype.*
  >
  > *Relational databases are at the core of backend engineering, but learning complex query optimizations, syntax structures, and preparing for interviews can be daunting. SQLSense AI bridges this gap. It acts as an expert SQL tutor, strictly constrained to database and query topics, preventing general off-topic distractions and hallucination errors."*

---

### 💻 Chapter 2: Technical Architecture & Modular Layout (0:45 - 1:30)
* **Visual**: Display the [docs/architecture.md](file:///c:/Users/steja/OneDrive/Desktop/SQL%20Learning%20Assistant/sqlsense-ai/docs/architecture.md) flow diagram or the root README file.
* **Speaker**:  
  > *"Architecturally, the application follows a clean client-server isolation:
  > * On the frontend, I used **React + Vite** with **Tailwind CSS v4** for a responsive glassmorphic dark interface.
  > * On the backend, we run a modular **FastAPI** application on Uvicorn.
  > * For the RAG database, instead of relying on slow cloud vector stores or simple keyword lookups, I implemented a local **ChromaDB** vector database utilizing the **all-MiniLM-L6-v2** Sentence Transformer model to run embeddings fully in-memory."*

---

### ⚡ Chapter 3: Live Demo (1:30 - 2:30)
* **Visual**: Click a Quick Action Card like "Explain INNER JOIN". Show the immediate layout transition to the chat window, the typing dots animation, and the generated markdown text. Scroll down to show the clickable source file pill card `joins.md`.
* **Speaker**:  
  > *"Let's see it in action. Clicking 'Explain INNER JOIN' triggers our RAG pipeline. The response returns in a standardized, educational template: Concept explanation, uppercase Syntax blocks, practical query examples, expected output tables, common pitfalls, and an interview tip. At the bottom, it lists the source citations as interactive pill cards. 
  > 
  > I've also built in three bonus tools:
  > 1. A client-side **SQL Formatter** that reformats messy queries.
  > 2. An **Interactive Quiz Mode** with instant grading and explanations.
  > 3. A **Practice Console** where users can type query answers against a mock table schema and get syntax validations."*

---

### 🔍 Chapter 4: Under the Hood: Ingestion & Retrieval (2:30 - 3:30)
* **Visual**: Show the code files inside [backend/rag/](file:///c:/Users/steja/OneDrive/Desktop/SQL%20Learning%20Assistant/sqlsense-ai/backend/rag/) in the editor.
* **Speaker**:  
  > *"Under the hood, we have a complete LangChain pipeline. On server startup, `vectordb.py` checks if the Chroma index exists. If missing, it uses a `DirectoryLoader` to read our 27 markdown files, splits them using `RecursiveCharacterTextSplitter` into 600-character chunks with 100 overlap, and writes the embeddings. 
  > 
  > If a user asks a question, the retriever extracts the top 3 semantic matches. If the user asks a question outside database topics, our system prompt forces the LLM to politely decline. If the query isn't answered in our local documentation, it safely returns our fallback message: 'I couldn't find sufficient information in my SQL knowledge base'."*

---

### 🛠️ Chapter 5: Engineering Challenges & Solutions (3:30 - 4:15)
* **Visual**: Point to the custom inline code citation parsing in [frontend/src/components/MessageItem.jsx](file:///c:/Users/steja/OneDrive/Desktop/SQL%20Learning%20Assistant/sqlsense-ai/frontend/src/components/MessageItem.jsx).
* **Speaker**:  
  > *"One major engineering challenge was integrating sources without forcing modifications to the frontend presentation. Rather than writing specialized JSON parsing schemas that could fail when streaming LLM responses, I extended the frontend ReactMarkdown code component. 
  > 
  > Now, whenever the renderer parses an inline code block ending in `.md`, it automatically converts it into a styled citation card. This maintains full UI consistency without complicating the API layer.
  > 
  > Additionally, updating to Tailwind CSS v4 required moving our configurations directly into the stylesheet using `@theme` blocks, resolving PostCSS compiler requirements."*

---

### 🔮 Chapter 6: Future Scope & Wrap-up (4:15 - 5:00)
* **Visual**: Show the [deploy/render.yaml](file:///c:/Users/steja/OneDrive/Desktop/SQL%20Learning%20Assistant/sqlsense-ai/deploy/render.yaml) file.
* **Speaker**:  
  > *"The codebase is fully configured for cloud deployments, with Vercel and Render configurations pre-wired.
  > 
  > In the future, this RAG model can be extended to dynamically extract table schemas straight from staging databases, generating schema documentation markdown files that get indexed automatically on startup.
  > 
  > Thank you for your time. I am ready to answer any questions!"*
