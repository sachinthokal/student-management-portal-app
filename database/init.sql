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
    ('Ananya', 'Patil', 'ananya.patil@smp.edu', 'Information Technology'),
    ('Rohan', 'Deshmukh', 'rohan.deshmukh@smp.edu', 'Artificial Intelligence & Data'),
    ('Priya', 'Kulkarni', 'priya.kulkarni@smp.edu', 'Electronics & Telecommunication'),
    ('Omkar', 'Pawar', 'omkar.pawar@smp.edu', 'Mechanical Engineering'),
    ('Sanket', 'Kadam', 'sanket.kadam@smp.edu', 'Civil Engineering'),
    ('Neha', 'Verma', 'neha.verma@smp.edu', 'Computer Science'),
    ('Kunal', 'Joshi', 'kunal.joshi@smp.edu', 'Information Technology'),
    ('Tanvi', 'Kulkarni', 'tanvi.kulkarni@smp.edu', 'Artificial Intelligence & Data'),
    ('Aditya', 'Shinde', 'aditya.shinde@smp.edu', 'Electronics & Telecommunication'),
    ('Rahul', 'More', 'rahul.more@smp.edu', 'Mechanical Engineering'),
    ('Mayuri', 'Jadhav', 'mayuri.jadhav@smp.edu', 'Civil Engineering'),
    ('Vikram', 'Aditya', 'vikram.aditya@smp.edu', 'Computer Science'),
    ('Pooja', 'Chavan', 'pooja.chavan@smp.edu', 'Information Technology'),
    ('Ishaan', 'Malhotra', 'ishaan.malhotra@smp.edu', 'Artificial Intelligence & Data'),
    ('Sneha', 'Gaikwad', 'sneha.gaikwad@smp.edu', 'Electronics & Telecommunication'),
    ('Gaurav', 'Bhosale', 'gaurav.bhosale@smp.edu', 'Mechanical Engineering'),
    ('Prathamesh', 'Sawant', 'prathamesh.sawant@smp.edu', 'Civil Engineering'),
    ('Siddharth', 'Nair', 'siddharth.nair@smp.edu', 'Information Technology'),
    ('Aditi', 'Rao', 'aditi.rao@smp.edu', 'Artificial Intelligence & Data'),
    ('Yash', 'Mehta', 'yash.mehta@smp.edu', 'Artificial Intelligence & Data')
ON CONFLICT (email) DO NOTHING;

