-- ==============================================================================
-- Student Management Portal (SMP) - Seed Data
-- Database Name: smp_db
-- ==============================================================================

-- Clear existing data if needed (optional)
-- TRUNCATE TABLE students RESTART IDENTITY CASCADE;

INSERT INTO students (first_name, last_name, email, department)
VALUES
    -- Computer Science
    ('Aarav', 'Sharma', 'aarav.sharma@smp.edu', 'Computer Science'),
    ('Rohan', 'Deshmukh', 'rohan.deshmukh@smp.edu', 'Computer Science'),
    ('Neha', 'Verma', 'neha.verma@smp.edu', 'Computer Science'),
    ('Vikram', 'Aditya', 'vikram.aditya@smp.edu', 'Computer Science'),
    
    -- Information Technology
    ('Ananya', 'Patil', 'ananya.patil@smp.edu', 'Information Technology'),
    ('Kunal', 'Joshi', 'kunal.joshi@smp.edu', 'Information Technology'),
    ('Pooja', 'Chavan', 'pooja.chavan@smp.edu', 'Information Technology'),
    ('Siddharth', 'Nair', 'siddharth.nair@smp.edu', 'Information Technology'),

    -- Artificial Intelligence & Data
    ('Tanvi', 'Kulkarni', 'tanvi.kulkarni@smp.edu', 'Artificial Intelligence & Data'),
    ('Ishaan', 'Malhotra', 'ishaan.malhotra@smp.edu', 'Artificial Intelligence & Data'),
    ('Aditi', 'Rao', 'aditi.rao@smp.edu', 'Artificial Intelligence & Data'),
    ('Yash', 'Mehta', 'yash.mehta@smp.edu', 'Artificial Intelligence & Data'),

    -- Electronics & Telecommunication
    ('Priya', 'Kulkarni', 'priya.kulkarni@smp.edu', 'Electronics & Telecommunication'),
    ('Aditya', 'Shinde', 'aditya.shinde@smp.edu', 'Electronics & Telecommunication'),
    ('Sneha', 'Gaikwad', 'sneha.gaikwad@smp.edu', 'Electronics & Telecommunication'),

    -- Mechanical Engineering
    ('Omkar', 'Pawar', 'omkar.pawar@smp.edu', 'Mechanical Engineering'),
    ('Rahul', 'More', 'rahul.more@smp.edu', 'Mechanical Engineering'),
    ('Gaurav', 'Bhosale', 'gaurav.bhosale@smp.edu', 'Mechanical Engineering'),

    -- Civil Engineering
    ('Sanket', 'Kadam', 'sanket.kadam@smp.edu', 'Civil Engineering'),
    ('Mayuri', 'Jadhav', 'mayuri.jadhav@smp.edu', 'Civil Engineering'),
    ('Prathamesh', 'Sawant', 'prathamesh.sawant@smp.edu', 'Civil Engineering')
ON CONFLICT (email) DO NOTHING;

