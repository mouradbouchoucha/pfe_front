import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
private baseUrl = 'http://localhost:8080/courses'
  constructor(
    private http: HttpClient
  ) { }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getAllCourseByName(name:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/${name}`);
  }
  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createCourse(imageFile: File,
                  name: string,
                  description: string,
                  duration:number,
                  startDateTime:Date,
                  ): Observable<any> {
    const formData = new FormData();
    
    formData.append('profilePictureFile', imageFile);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('duration', duration.toString());
    formData.append('startDateTime', startDateTime.toISOString());
    return this.http.post<any>(`${this.baseUrl}/create`, formData)
      
  }
  updateCourse(  id: number,
                  imageFile: File | null, 
                  name: string,      
                  description: string,
                  duration: number,
                  startDateTime:Date,
              ): Observable<any> {
    const url = `${this.baseUrl}/update/${id}`;
    const formData = new FormData();
    
    formData.append('firstName',name);
    formData.append('lastName', description);
    formData.append('email',duration.toString())
    formData.append('phoneNumber', startDateTime.toISOString());
  
    if (imageFile) {
      formData.append('profilePictureFile', imageFile);
    }

    return this.http.put<any>(url, formData)
      .pipe(
        catchError(error => {
          console.error('Error updating category:', error);
          return throwError(error);
        })
      );
  }
  

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
