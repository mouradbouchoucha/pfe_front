import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EnrollmentStatus } from 'src/app/interfaces/enrollmentStatus';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiUrl = `http://localhost:9090/api/enrollment`;

  constructor(private http: HttpClient) { }

  
   
  checkEnrollmentStatus(courseId: number, traineeId: number) {
    return this.http.get<EnrollmentStatus>
    (`${this.apiUrl}/check-enrollment-status?courseId=${courseId}&traineeId=${traineeId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createEnrollment(enrollmentData: any) {
    return this.http.post(`${this.apiUrl}/create`, enrollmentData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error || error.message;
    }
    return throwError(errorMessage);
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

  checkEnrollmentExists(courseId: number,traineeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-enrollment-exists?courseId=${courseId}&traineeId=${traineeId}`);
  }
}
