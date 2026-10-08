# ====================================================================
# SQLSense AI - React + Vite Frontend Dockerfile
# Multi-stage build: Node.js compiler + Nginx static server
# ====================================================================

# Stage 1: Build static assets
FROM node:20-alpine AS build

WORKDIR /app

# Copy package specifications for optimal Docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy application source code and configs
COPY . .

# Optional build argument to customize API endpoint (defaults to relative URL for Nginx proxy)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Compile the production React application
RUN npm run build

# Stage 2: Serve compiled assets using lightweight Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA bundle from the builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check to ensure Nginx is serving files
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
