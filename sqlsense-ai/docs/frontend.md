# Frontend Documentation

This document describes the structure and components of the React frontend of **SQLSense AI**.

---

## 📂 Core Structure

The React application is managed inside the `frontend/` directory, scaffolded using Vite.

```
frontend/
├── public/
├── src/
│   ├── assets/            # Static assets
│   ├── components/        # Reusable UI elements
│   │   ├── AboutModal.jsx      # System info & SQL topics dialog
│   │   ├── ChatWindow.jsx      # Scroll manager & typing indicator
│   │   ├── CodeBlock.jsx       # PrismJS syntax highlights with copy actions
│   │   ├── FormatterModal.jsx  # Interactive SQL query beautifier modal
│   │   ├── Hero.jsx            # Product tagline and features landing panel
│   │   ├── MessageItem.jsx     # Bubble parser overriding Markdown elements
│   │   ├── Navbar.jsx          # Header with sidebar menu & settings buttons
│   │   ├── PracticeModal.jsx   # Coding challenges modal console
│   │   ├── QuizModal.jsx       # Interactive MCQ quiz modal
│   │   ├── Sidebar.jsx         # Sidebar history & quick links triggers
│   │   └── SuggestedPrompts.jsx# Quick floating query tags
│   ├── App.jsx            # Main app router, downloads chat logs, shortcuts
│   ├── index.css          # Global Tailwind CSS configurations & keyframes
│   └── main.jsx           # App entry point
```

---

## 🎨 Theme & Glassmorphism Design System

The application utilizes a dark theme with purple and blue gradients (`#030712` Slate-950 background) styled via **Tailwind CSS v4**.

* **Glassmorphism**: Done using semi-transparent containers, blur blurs, and borders:
  ```css
  .glass-panel {
    background-color: rgba(11, 15, 25, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  ```
* **Shimmer loading state**: Custom CSS animates data grids and typing dots.
* **Scrollbars**: Customized scroll indicators matching slate scales.

---

## 🛠️ Components Details

1. **`App.jsx`**: Houses states (chats, loading, active modals) and binds shortcut key events (`Ctrl+F` for SQL Formatter, `Ctrl+H` for Sidebar, `Ctrl+Q` for Quiz, `Ctrl+P` for Practice, `Esc` to close). It also handles logs downloads.
2. **`MessageItem.jsx`**: Converts Markdown tables to clean data frames, styles headers, and translates reference source files (e.g. `joins.md`) into clickable pill cards automatically.
3. **`CodeBlock.jsx`**: Hooks into PrismJS. When new value loads, it triggers syntax highlighting and adds a copy button with a success tooltip.
4. **`FormatterModal.jsx`**: Runs a pure JS regex beautifier converting user-typed SQL into uppercase keywords with proper line-breaks.
5. **`PracticeModal.jsx`**: Exposes a Mock Employees Table Schema and runs syntax tests checking user-written query answers.
6. **`QuizModal.jsx`**: Displays multiple choice questions, checks user score, and displays correct answers with comments.
7. **`Sidebar.jsx`**: Saves user questions in LocalStorage, keeping the top 8 queries, and lists them as clickable logs to re-run queries easily.
