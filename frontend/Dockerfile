# ==============================================================================
# SMP Frontend - Multi-Stage Dockerfile (Angular 22 / Nginx Alpine)
# ==============================================================================

# Stage 1: Build the Angular App
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions for efficient layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build for production
COPY . ./
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

LABEL maintainer="SMP DevOps Team"
LABEL description="Nginx web server hosting Angular 22 SMP Portal"

# Copy built browser static assets from builder stage
COPY --from=builder /app/dist/student-management-portal-frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration for Angular SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
