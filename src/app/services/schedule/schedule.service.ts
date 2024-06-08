import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Schedule {
  id: number;
  subject: string;
  trainer: string;
  startDateTime: string;
  duration: number;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = 'http://localhost:8080/api/schedules'; // Base URL for the API

  constructor(private http: HttpClient) {}

  createSchedule(schedule: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, schedule).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleById(id: number): Observable<any> {
    console.log(this.http.get<any>(`${this.baseUrl}/${id}`));
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  

  getAllSchedules(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateSchedule(id: number, schedule: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, schedule);
  }

  getScheduleByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/course/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleByTrainerId(trainerId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.baseUrl}/trainer/${trainerId}`).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleByTrainerIdAndCourseId(trainerId: number, courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trainer/${trainerId}/course/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  checkForScheduleByStartDateTime(startDateTime:any): Observable<any> {
    const params = new HttpParams().set('startDateTime', startDateTime);

    return this.http.get<any>(`${this.baseUrl}/exist`, {
      params
    }).pipe(
      catchError(this.handleError)
    );
  }
  getScheduleByStartDateTime(startDateTime: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/startDateTime`, {
      params: { startDateTime }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Log error to the console or a logging service
    console.error('An error occurred:', error);
    // Customize this to display a user-friendly message
    return throwError('Something went wrong; please try again later.');
  }
}
