-- ==============================================================================
-- Student Management Portal (SMP) - Database Schema
-- Database Name: smp_db
-- Target: PostgreSQL 15 / 16 / 17
-- ==============================================================================

-- Create students table matching com.smp.studentmanagementportal.model.Student
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimized querying and fast lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_names ON students(first_name, last_name);

-- Comment metadata
COMMENT ON TABLE students IS 'Stores registered student directory information for SMP Portal';
COMMENT ON COLUMN students.id IS 'Primary key identifier for student';
COMMENT ON COLUMN students.first_name IS 'Student given name';
COMMENT ON COLUMN students.last_name IS 'Student family name';
COMMENT ON COLUMN students.email IS 'Official campus email address (unique constraint)';
COMMENT ON COLUMN students.department IS 'Academic department/branch name';

