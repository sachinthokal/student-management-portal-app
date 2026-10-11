import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from './models/student.model';
import { StudentService } from './services/student.service';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Student Directory';

  // State Signals
  students = signal<Student[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');
  isServerConnected = signal<boolean>(false);
  lastRefreshed = signal<Date | null>(null);

  // Search & Filter Signals
  searchQuery = signal<string>('');
  selectedDepartment = signal<string>('ALL');

  // Modal Controls
  isModalOpen = signal<boolean>(false);
  modalMode = signal<'create' | 'edit'>('create');
  formStudent = signal<Student>({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Computer Science'
  });

  // Delete Confirmation
  studentToDelete = signal<Student | null>(null);

  // User-friendly Toast Feedback
  toast = signal<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  private toastTimeout: any;

  // Real-world Departments
  availableDepartments: string[] = [
    'Computer Science',
    'Information Technology',
    'Artificial Intelligence & Data',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  // Computed Properties for Real Users
  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const dept = this.selectedDepartment();

    return this.students().filter(s => {
      const matchesDept = (dept === 'ALL') || (s.department === dept);
      if (!matchesDept) return false;

      if (!query) return true;
      const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
      const email = (s.email || '').toLowerCase();
      const department = (s.department || '').toLowerCase();
      const id = String(s.id || '');

      return fullName.includes(query) || email.includes(query) || department.includes(query) || id.includes(query);
    });
  });

  totalCount = computed(() => this.students().length);
  
  departmentCount = computed(() => {
    const depts = new Set(this.students().map(s => s.department).filter(Boolean));
    return depts.size;
  });

  constructor(
    private studentService: StudentService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger.info('AppComponent', 'Initializing SMP Campus Portal UI');
    this.getStudents();
  }

  // Load students
  getStudents(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.logger.info('AppComponent', 'Refreshing student directory from backend...');

    this.studentService.getStudentsList().subscribe({
      next: (data) => {
        this.students.set(data);
        this.isLoading.set(false);
        this.isServerConnected.set(true);
        this.lastRefreshed.set(new Date());
        this.logger.success('AppComponent', `Loaded ${data.length} students into directory state`);
      },
      error: (err) => {
        this.logger.error('AppComponent', 'Failed to connect to campus backend', err);
        this.isServerConnected.set(false);
        this.errorMessage.set('Campus network is temporarily offline. Please ensure the server service is running.');
        this.isLoading.set(false);
        this.showToast('Unable to connect to campus server. Trying to reconnect...', 'error');
      }
    });
  }

  // Search input handler
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.logger.debug('AppComponent', `Search query updated: "${query}" (Matching: ${this.filteredStudents().length} records)`);
  }

  // Department filter handler
  onDepartmentFilter(dept: string): void {
    this.selectedDepartment.set(dept);
    this.logger.info('AppComponent', `Department filter switched to: "${dept}" (Active records: ${this.filteredStudents().length})`);
  }

  // Open Registration Modal
  openCreateModal(): void {
    this.logger.debug('AppComponent', 'Opening student enrollment modal');
    this.modalMode.set('create');
    this.formStudent.set({
      firstName: '',
      lastName: '',
      email: '',
      department: 'Computer Science'
    });
    this.isModalOpen.set(true);
  }

  // Open Edit Profile Modal
  openEditModal(student: Student): void {
    this.logger.debug('AppComponent', `Opening edit modal for student ID #${student.id}`);
    this.modalMode.set('edit');
    this.formStudent.set({ ...student });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  // Save Student (Enroll or Update)
  saveStudent(): void {
    const s = this.formStudent();
    if (!s.firstName?.trim() || !s.lastName?.trim() || !s.email?.trim()) {
      this.logger.warn('AppComponent', 'Validation failed: Required fields missing');
      this.showToast('Please fill in student name and email address.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(s.email.trim())) {
      this.logger.warn('AppComponent', `Validation failed: Invalid email format "${s.email}"`);
      this.showToast('Please enter a valid student email address.', 'error');
      return;
    }

    this.isSaving.set(true);

    if (this.modalMode() === 'create') {
      this.logger.info('AppComponent', `Submitting new student enrollment: ${s.firstName} ${s.lastName}`);
      this.studentService.createStudent(s).subscribe({
        next: (created) => {
          this.students.update(list => [...list, created]);
          this.isSaving.set(false);
          this.closeModal();
          this.logger.success('AppComponent', `Successfully registered student ID #${created.id}: ${created.firstName} ${created.lastName}`);
          this.showToast(`${created.firstName} ${created.lastName} has been enrolled successfully!`, 'success');
        },
        error: (err) => {
          this.logger.error('AppComponent', 'Enrollment request failed', err);
          this.isSaving.set(false);
          this.showToast('Could not register student. Email might already be registered.', 'error');
        }
      });
    } else {
      if (!s.id) return;
      this.logger.info('AppComponent', `Submitting profile update for student ID #${s.id}`);
      this.studentService.updateStudent(s.id, s).subscribe({
        next: (updated) => {
          this.students.update(list => list.map(item => item.id === updated.id ? updated : item));
          this.isSaving.set(false);
          this.closeModal();
          this.logger.success('AppComponent', `Successfully updated student ID #${updated.id}`);
          this.showToast(`Student profile for ${updated.firstName} updated!`, 'success');
        },
        error: (err) => {
          this.logger.error('AppComponent', `Update request failed for student ID #${s.id}`, err);
          this.isSaving.set(false);
          this.showToast('Failed to update student profile.', 'error');
        }
      });
    }
  }

  // Delete Confirmation Handlers
  promptDelete(student: Student): void {
    this.logger.debug('AppComponent', `Prompting delete confirmation for student ID #${student.id}`);
    this.studentToDelete.set(student);
  }

  cancelDelete(): void {
    this.studentToDelete.set(null);
  }

  confirmDelete(): void {
    const target = this.studentToDelete();
    if (!target || !target.id) return;

    this.logger.info('AppComponent', `Executing removal of student ID #${target.id} (${target.firstName} ${target.lastName})`);
    this.studentService.deleteStudent(target.id).subscribe({
      next: () => {
        this.students.update(list => list.filter(s => s.id !== target.id));
        this.studentToDelete.set(null);
        this.logger.success('AppComponent', `Student ID #${target.id} removed from directory`);
        this.showToast(`${target.firstName} ${target.lastName} removed from student directory.`, 'info');
      },
      error: (err) => {
        this.logger.error('AppComponent', `Failed to delete student ID #${target.id}`, err);
        this.studentToDelete.set(null);
        this.showToast('Could not remove student record. Please try again.', 'error');
      }
    });
  }

  // Export Directory to CSV
  exportCSV(): void {
    const data = this.filteredStudents();
    if (data.length === 0) {
      this.logger.warn('AppComponent', 'Export cancelled: No records available');
      this.showToast('No student records to download.', 'info');
      return;
    }

    this.logger.info('AppComponent', `Exporting ${data.length} student records to CSV`);
    let csvContent = 'Student ID,First Name,Last Name,Email,Department\n';
    data.forEach(s => {
      csvContent += `"${s.id || ''}","${s.firstName || ''}","${s.lastName || ''}","${s.email || ''}","${s.department || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.logger.success('AppComponent', 'CSV export generated and downloaded successfully');
    this.showToast('Student directory report downloaded!', 'success');
  }

  // Toast System
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast.set({ message, type });
    this.toastTimeout = setTimeout(() => {
      this.toast.set(null);
    }, 3500);
  }

  // Department Badges
  getDepartmentBadgeClass(dept?: string): string {
    switch (dept) {
      case 'Computer Science':
        return 'badge-cs';
      case 'Information Technology':
        return 'badge-it';
      case 'Artificial Intelligence & Data':
        return 'badge-ai';
      case 'Electronics & Telecommunication':
        return 'badge-entc';
      case 'Mechanical Engineering':
        return 'badge-mech';
      case 'Civil Engineering':
        return 'badge-civil';
      default:
        return 'badge-default';
    }
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return f + l || 'ST';
  }

  getAvatarGradient(id?: number): string {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
    ];
    return gradients[(id || 0) % gradients.length];
  }
}