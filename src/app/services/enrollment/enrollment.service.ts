import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiUrl = `http://localhost:9090/api/enrollement`;

  constructor(private http: HttpClient) { }

  // Create an enrollment request
  createEnrollment(any: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, any);
  }

  // Approve an enrollment request by ID
  approveEnrollment(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approve/${id}`, {});
  }

  // Reject an enrollment request by ID
  rejectEnrollment(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reject/${id}`, {});
  }
  // Get all pending enrollment requests
  getPendingEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  // Get all approved enrollment requests
  getApprovedEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/approved`);
  }

  // Get all rejected enrollment requests
  getRejectedEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rejected`);
  }

  // Get enrolled trainees by course ID
  getEnrolledTraineesByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainees/course/${courseId}`);
  }

  // Get enrolled trainees by course ID and status
  getEnrolledTraineesByCourseAndStatus(courseId: number, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainees/course/${courseId}/status/${status}`);
  }

  // Get enrollment requests by trainee ID
  getEnrollmentsByTrainee(traineeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainee/${traineeId}`);
  }

  getAllEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
