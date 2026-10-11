# 🗄️ SMP Database Setup & Data Management

This directory contains database schemas, seed records, and container definitions for the **Student Management Portal (SMP)**.

---

## 📁 Files Overview

| File | Purpose |
| :--- | :--- |
| **[`schema.sql`](file:///home/sachinthokal/devops-workspace/projects/database/schema.sql)** | DDL schema script creating the `students` table, constraints, and indexes. |
| **[`seed_data.sql`](file:///home/sachinthokal/devops-workspace/projects/database/seed_data.sql)** | Sample student records across Computer Science, IT, AI & Data, ENTC, Mech, and Civil engineering branches. |
| **[`init.sql`](file:///home/sachinthokal/devops-workspace/projects/database/init.sql)** | Combined startup script auto-mounted by Docker into `/docker-entrypoint-initdb.d/`. |
| **[`docker-compose.yml`](file:///home/sachinthokal/devops-workspace/projects/database/docker-compose.yml)** | One-command PostgreSQL 17 Alpine database launcher with persistent storage and health check. |

---

## 🚀 Quick Start (Running PostgreSQL with Docker)

To start the database with all tables and student data preloaded:

```bash
cd /home/sachinthokal/devops-workspace/projects/database
docker compose up -d
```

To verify database status:
```bash
docker exec -it smp-postgres-db psql -U postgres -d smp_db -c "SELECT COUNT(*) FROM students;"
```

---

## 📋 Table Structure (`students`)

```sql
CREATE TABLE students (
    id          BIGSERIAL PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    department  VARCHAR(150) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 Spring Boot Configuration

In [`student-management-portal-backend/src/main/resources/application.properties`](file:///home/sachinthokal/devops-workspace/projects/student-management-portal-backend/src/main/resources/application.properties):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smp_db
spring.datasource.username=postgres
spring.datasource.password=admin
spring.jpa.hibernate.ddl-auto=update
```

