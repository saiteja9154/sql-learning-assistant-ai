# API Endpoints Documentation

This document describes the REST API endpoints provided by the **FastAPI** backend of **SQLSense AI**. The default server runs on `http://localhost:8000`.

---

## 📡 Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`  | `/health`| Check server health and API key status | None |
| `GET`  | `/about` | Fetch project metadata and list of supported topics | None |
| `POST` | `/chat`  | Send messages history to the RAG pipeline and get answers | None |

---

## 🛠️ Details & Schema Contracts

### 1. Health Check
* **Endpoint**: `/health`
* **Method**: `GET`
* **Response Payload (`200 OK`)**:
  ```json
  {
    "status": "healthy",
    "gemini_api_key_configured": true
  }
  ```

---

### 2. About Metadata
* **Endpoint**: `/about`
* **Method**: `GET`
* **Response Payload (`200 OK`)**:
  ```json
  {
    "app_name": "SQLSense AI",
    "version": "1.0.0",
    "tagline": "Your Intelligent SQL Learning Assistant",
    "supported_topics": [
      "Create Table",
      "Insert",
      "Update",
      "Delete",
      "...",
      "Triggers"
    ],
    "rag_ready": true
  }
  ```

---

### 3. RAG Chat Processor
* **Endpoint**: `/chat`
* **Method**: `POST`
* **Request Headers**:
  ```http
  Content-Type: application/json
  ```
* **Request Payload**:
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "Explain INNER JOIN"
      }
    ]
  }
  ```
* **Response Payload (`200 OK`)**:
  ```json
  {
    "reply": "### 💡 Explanation\nAn INNER JOIN combines records from two tables based on matching column keys...\n\n### 📄 Sources\n- `joins.md` \n- `select.md`",
    "context_used": "joins.md, select.md"
  }
  ```
* **Errors Codes**:
  * `400 Bad Request`: Conversation history cannot be empty.
  * `500 Internal Server Error`: Issues querying ChromaDB or connecting to Gemini.
