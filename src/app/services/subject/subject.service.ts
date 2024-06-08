import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl = 'http://localhost:8080/api/subjects';

  constructor(private http: HttpClient) { }

  createSubject(subject: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, subject);
  }

  getSubjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subject/${id}`);
  }

  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  updateSubject(id: number, subject: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, subject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
