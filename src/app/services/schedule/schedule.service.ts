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
  private baseUrl = 'http://localhost:9090/api/schedules'; // Base URL for the API

  constructor(private http: HttpClient) {}

  createSchedule(schedule: any, course_id: number): Observable<any> {
    const params = new HttpParams().set('course_id', course_id.toString());
    console.log(params.toString(),schedule);
    return this.http.post<any>(`${this.baseUrl}/create`, schedule, { params }).pipe(
      catchError(this.handleError)
    );
}

  getScheduleById(id: number): Observable<any> {
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
    return this.http.put<any>(`${this.baseUrl}/${id}`, schedule).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/course/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleByTrainerId(trainerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trainer/${trainerId}`).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleByTrainerIdAndCourseId(trainerId: number, courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trainer/${trainerId}/course/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  checkForScheduleByStartDateTime(startDateTime: string, courseId: number): Observable<boolean> {
    const params = new HttpParams().set('startDateTime', startDateTime).set('courseId', courseId);
    return this.http.get<boolean>(`${this.baseUrl}/exist`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getScheduleByStartDateTime(startDateTime: string): Observable<any[]> {
    const cleanStartDateTime = startDateTime
    // .split('+')[0];
    console.log(cleanStartDateTime);
    const params = new HttpParams()
      .set('startDateTime', cleanStartDateTime)
      
    return this.http.get<any[]>(`${this.baseUrl}/startDateTime`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getAvailableTrainers(startDateTime: string, duration: number): Observable<any[]> {
    // Ensure the date-time string is in ISO_LOCAL_DATE_TIME format (without timezone)
    const cleanStartDateTime = startDateTime
                              // .split('+')[0];
    console.log(cleanStartDateTime);
    const params = new HttpParams()
      .set('startDateTime', cleanStartDateTime)
      .set('duration', duration.toString());
    return this.http.get<any[]>(`${this.baseUrl}/available-trainers`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
