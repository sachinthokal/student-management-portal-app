package com.smp.studentmanagementportal.controller;

import com.smp.studentmanagementportal.model.Student;
import com.smp.studentmanagementportal.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
@Slf4j
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents() {
        log.info("[CONTROLLER] Received request to fetch all students");
        List<Student> students = studentService.getAllStudents();
        log.info("[CONTROLLER] Returning {} students to client", students.size());
        return students;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        log.info("[CONTROLLER] Received request to fetch student by ID: {}", id);
        return studentService.getStudentById(id)
                .map(student -> {
                    log.info("[CONTROLLER] Found student ID {}: {} {}", id, student.getFirstName(), student.getLastName());
                    return ResponseEntity.ok(student);
                })
                .orElseGet(() -> {
                    log.warn("[CONTROLLER] Student ID {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        log.info("[CONTROLLER] Received request to enroll student: {} {} (email: {}, dept: {})",
                student.getFirstName(), student.getLastName(), student.getEmail(), student.getDepartment());
        Student saved = studentService.saveStudent(student);
        log.info("[CONTROLLER] Student enrolled successfully with generated ID: {}", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        log.info("[CONTROLLER] Received request to update student ID: {}", id);
        Student updated = studentService.updateStudent(id, student);
        log.info("[CONTROLLER] Student ID: {} successfully updated", id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        log.info("[CONTROLLER] Received request to delete student ID: {}", id);
        studentService.deleteStudent(id);
        log.info("[CONTROLLER] Student ID: {} deletion completed", id);
        return ResponseEntity.ok().build();
    }
}