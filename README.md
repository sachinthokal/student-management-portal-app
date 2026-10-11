# 🎓 SMP - Student Management Portal

An enterprise-grade, full-stack Student Management Portal built with **Spring Boot 3**, **Angular 22**, and **PostgreSQL 17**. Features clean glassmorphism UI, real-time search and department filtering, distributed HTTP tracing, and zero security vulnerabilities.

---

## 🏗️ Architecture & Directory Structure

```text
student-management-portal-app/
├── backend/                 # Spring Boot 3 REST API Application
│   ├── src/                 # Controllers, Services, Models, Filters, Exceptions
│   ├── pom.xml              # Maven dependencies (patched & zero-CVE)
│   └── mvnw                 # Executable Maven Wrapper
├── frontend/                # Angular 22 Modern Web Client
│   ├── src/                 # Standalone components, services, interceptors
│   ├── angular.json         # Angular build configuration
│   └── package.json         # NPM dependencies & scripts
├── database/                # PostgreSQL Initialization & Seed Scripts
│   ├── schema.sql           # DDL schema for students table
│   ├── seed_data.sql        # Realistic sample student dataset
│   ├── init.sql             # Combined container init script
│   └── docker-compose.yml   # PostgreSQL 17 Alpine launcher
└── README.md                # Project documentation
```

---

## 🚀 Quick Start Guide

### 1️⃣ Start the PostgreSQL Database
```bash
cd database
docker compose up -d
```
* **Host:** `localhost` | **Port:** `5432`
* **Database:** `smp_db` | **Username:** `postgres` | **Password:** `admin`

### 2️⃣ Start the Spring Boot Backend
```bash
cd ../backend
./mvnw spring-boot:run
```
* **API Base URL:** `http://localhost:8080/api/students`

### 3️⃣ Start the Angular Frontend
```bash
cd ../frontend
npm install
npm start
```
* Open your browser at **`http://localhost:4200`**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students` | Retrieve all student records |
| `GET` | `/api/students/{id}` | Retrieve a single student by ID |
| `POST` | `/api/students` | Enroll a new student |
| `PUT` | `/api/students/{id}` | Update existing student profile |
| `DELETE` | `/api/students/{id}` | Remove student from directory |

---

## 🔍 Observability & Tracing

* **Correlation IDs (`X-Correlation-ID`):** Automatically injected on all HTTP requests from frontend through backend MDC logs.
* **Backend Logging:** Configured with SLF4J / Logback ANSI colors, timing metrics, and structured exceptions.
* **Frontend Telemetry:** Browser console logger with color-coded status badges and latency measurements.
* **Security (Trivy):** 100% verified clean with 0 vulnerabilities across all dependencies.
