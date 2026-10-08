# ====================================================================
# SQLSense AI - FastAPI Backend Dockerfile
# Python 3.12 Slim production runtime
# ====================================================================

FROM python:3.12-slim

# Set environment variables for Python runtime optimization
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8000 \
    KNOWLEDGE_DIR=/app/knowledge

WORKDIR /app

# Install dependencies in a separate layer for optimal caching
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code and SQL knowledge markdown files
COPY backend/app /app/app
COPY knowledge /app/knowledge

# Expose backend API port
EXPOSE 8000

# Health check to ensure FastAPI is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Start the FastAPI server using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
