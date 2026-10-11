# ==============================================================================
# SMP Database - PostgreSQL 17 Container
# ==============================================================================
FROM postgres:17-alpine

LABEL maintainer="SMP DevOps Team"
LABEL description="PostgreSQL container for Student Management Portal"

# Upgrade Alpine packages and replace vulnerable gosu Go binary with lightweight C-based su-exec
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache su-exec && \
    sed -i 's/exec gosu postgres/exec su-exec postgres/g' /usr/local/bin/docker-entrypoint.sh && \
    rm -f /usr/local/bin/gosu

# Environment defaults (matches backend application.properties)
ENV POSTGRES_DB=smp_db \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=admin

# Auto-execute schema & seed data on initialization
COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432

# Health check to ensure PostgreSQL is ready for incoming connections
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres -d smp_db || exit 1
