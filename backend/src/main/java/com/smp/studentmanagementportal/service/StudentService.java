package com.smp.studentmanagementportal.service;

import com.smp.studentmanagementportal.model.Student;
import com.smp.studentmanagementportal.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        log.debug("[SERVICE] Querying database for all student records");
        List<Student> students = studentRepository.findAll();
        log.info("[SERVICE] Retrieved {} students from database", students.size());
        return students;
    }

    public Optional<Student> getStudentById(Long id) {
        log.debug("[SERVICE] Querying database for student ID: {}", id);
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            log.info("[SERVICE] Student ID: {} found in database", id);
        } else {
            log.warn("[SERVICE] Student ID: {} not found in database", id);
        }
        return student;
    }

    public Student saveStudent(Student student) {
        log.info("[SERVICE] Saving new student record: {} {} (dept: {})",
                student.getFirstName(), student.getLastName(), student.getDepartment());
        Student saved = studentRepository.save(student);
        log.info("[SERVICE] Student saved successfully with ID: {}", saved.getId());
        return saved;
    }

    public Student updateStudent(Long id, Student studentDetails) {
        log.info("[SERVICE] Updating student ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("[SERVICE] Cannot update: Student ID: {} not found", id);
                    return new RuntimeException("Student not found with id: " + id);
                });

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setDepartment(studentDetails.getDepartment());

        Student updated = studentRepository.save(student);
        log.info("[SERVICE] Student ID: {} updated successfully in database", id);
        return updated;
    }

    public void deleteStudent(Long id) {
        log.info("[SERVICE] Deleting student ID: {} from database", id);
        if (!studentRepository.existsById(id)) {
            log.warn("[SERVICE] Student ID: {} does not exist, proceeding with deletion call", id);
        }
        studentRepository.deleteById(id);
        log.info("[SERVICE] Student ID: {} deleted successfully", id);
    }
}