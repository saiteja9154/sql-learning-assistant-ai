# ====================================================================
# SQLSense AI - Unified Single-Container Dockerfile
# Combines React SPA build & FastAPI backend in a single container
# ====================================================================

# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Install frontend dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install

# Build static React production bundle
COPY frontend/ ./
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Python Backend runtime serving API and SPA static bundle
FROM python:3.12-slim

WORKDIR /app

# Optimize Python execution
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8000 \
    KNOWLEDGE_DIR=/app/knowledge \
    FRONTEND_DIST_DIR=/app/frontend/dist

# Install backend dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and local SQL knowledge base
COPY backend/app /app/app
COPY knowledge /app/knowledge

# Copy compiled frontend SPA bundle from Stage 1
COPY --from=frontend-builder /frontend/dist /app/frontend/dist

# Expose single unified port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Start FastAPI server serving both API routes and React SPA static assets
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
