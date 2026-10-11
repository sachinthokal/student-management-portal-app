# ==============================================================================
# SMP Backend - Multi-Stage Dockerfile (Spring Boot 3 / Java 21)
# ==============================================================================

# Stage 1: Build the Application
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and POM for layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B || true

# Copy application source code and package JAR
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Production Runtime
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="SMP DevOps Team"
LABEL description="Spring Boot Backend Service for Student Management Portal"

WORKDIR /app

# Upgrade Alpine packages to patch OS-level CVEs (e.g., libpng, zlib) and run as non-root user
RUN apk update && apk upgrade --no-cache && \
    addgroup -S smpgroup && adduser -S smpuser -G smpgroup

# Copy compiled JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership
RUN chown -R smpuser:smpgroup /app

USER smpuser

EXPOSE 8080

# Production JVM flags optimized for container memory constraints
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
