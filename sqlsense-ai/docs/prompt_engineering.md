# Prompt Engineering Documentation

This document explains the prompt design, role constraints, formatting directives, and anti-hallucination guardrails of **SQLSense AI**.

---

## 🎯 System Prompt Persona

The system instruction configures the LLM (`gemini-1.5-flash`) as an **Expert SQL Tutor and Intelligent SQL Learning Assistant**. It enforces a strict teaching persona:
* Explaining relational concepts simply and in a beginner-friendly way.
* Offering detailed, structured answers to help candidates prepare for technical interviews.

---

## 🔒 Scope Guardrails & Rejection Policy

To keep the application highly focused and professional, the system prompt defines strict scope guardrails:
1. **SQL-Only Rule**: The chatbot must only answer questions relating to database concepts, tables, indexes, queries, optimization, normalization, and relational databases.
2. **Rejection Policy**: If the user asks general chat questions, coding in unrelated languages (HTML, Javascript, Python scripts that aren't SQL-related), or recipes, it must return:
   > "I am SQLSense AI, your dedicated SQL learning assistant. I can only assist you with SQL-related questions, query generation, query debugging, database schemas, or SQL interview prep. How can I help you with SQL today?"
3. **Anti-Hallucination Constraints**: If a query asks something that isn't contained in the retrieved context chunks (e.g. *What is DB2 clustering configurations?* or *Explain Oracle Exadata architecture*), the model is instructed to output exactly:
   > "I couldn't find sufficient information in my SQL knowledge base."

---

## 📊 Structured Response Template

The prompt templates mandate a rigid response structure. Every SQL answer must follow this format:

```markdown
### 💡 Explanation
[Concept explanation]

### 🔍 Syntax
[Generic syntax block]

### 💻 Practical Example
[Concrete SQL query block using code highlights]

### 📊 Expected Output
[Expected output table represented in Markdown]

### ⚠️ Common Mistakes
[List of common mistakes from the retrieved context]

### 🎯 Interview Tip
[Interview tip or typical question from context]

### ⚡ Performance Tip
[Performance tip from retrieved context]

### 🛠️ Best Practice
[Clean coding best practice from context]

### 📄 Sources
- `filename.md`
```
These sections correspond to markdown elements styled directly on the frontend client (e.g., custom border styles on headers, styled cards on inline `.md` codes, and formatted scrollbars for tables).
