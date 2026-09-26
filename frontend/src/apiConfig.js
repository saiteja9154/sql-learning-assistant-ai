// API base URL configuration:
// In local development, fallback automatically to FastAPI at http://localhost:8000
// In production (e.g. Render / Vercel), use VITE_API_URL or relative path when hosted together
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");

export default API_URL;
