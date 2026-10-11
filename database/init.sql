-- ==============================================================================
-- Student Management Portal (SMP) - Database Initialization
-- Auto-executed by PostgreSQL container on startup via /docker-entrypoint-initdb.d/
-- ==============================================================================

-- 1. Create Schema
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_names ON students(first_name, last_name);

-- 3. Populate Seed Data
INSERT INTO students (first_name, last_name, email, department)
VALUES
    ('Aarav', 'Sharma', 'aarav.sharma@smp.edu', 'Computer Science'),
    ('Ananya', 'Patil', 'ananya.patil@smp.edu', 'Information Technology')
ON CONFLICT (email) DO NOTHING;


