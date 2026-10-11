import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Backend Spring Boot API URL
  private readonly baseURL = 'http://localhost:8080/api/students';

  constructor(
    private httpClient: HttpClient,
    private logger: LoggerService
  ) {}

  // Get all students
  getStudentsList(): Observable<Student[]> {
    this.logger.info('StudentService', 'Initiating request to fetch all students');
    return this.httpClient.get<Student[]>(`${this.baseURL}`);
  }

  // Get student by ID
  getStudentById(id: number): Observable<Student> {
    this.logger.info('StudentService', `Initiating request to fetch student ID #${id}`);
    return this.httpClient.get<Student>(`${this.baseURL}/${id}`);
  }

  // Create student
  createStudent(student: Student): Observable<Student> {
    this.logger.info('StudentService', `Initiating enrollment for student: ${student.firstName} ${student.lastName} (${student.email})`);
    return this.httpClient.post<Student>(`${this.baseURL}`, student);
  }

  // Update student
  updateStudent(id: number, student: Student): Observable<Student> {
    this.logger.info('StudentService', `Initiating profile update for student ID #${id}`);
    return this.httpClient.put<Student>(`${this.baseURL}/${id}`, student);
  }

  // Delete student
  deleteStudent(id: number): Observable<void> {
    this.logger.info('StudentService', `Initiating delete request for student ID #${id}`);
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }
}