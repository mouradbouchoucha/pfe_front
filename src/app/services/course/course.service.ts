import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:9090/api/courses';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all_SortedByCreatedAt`)
      .pipe(catchError(this.handleError));
  }

  getAllCourseByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search?name=${name}`)
      .pipe(catchError(this.handleError));
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createCourse(
    imageFile: File | null,
    name: string,
    description: string,
    duration: number,
    startDateTime: Date,
    category_id: number,
  ): Observable<any> {
    const formData = new FormData();
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    formData.append('name', name);
    formData.append('description', description);
    formData.append('duration', duration.toString());
    formData.append('startDateTime', startDateTime.toISOString());
    formData.append('category_id', category_id.toString());

    return this.http.post<any>(this.baseUrl, formData)
      .pipe(catchError(this.handleError));
  }

  // updateCourse(
  //   id: number,
  //   name: string,
  //   description: string,
  //   duration: number,
  //   startDateTime: string,
  //   categoryId: number = 1,
  //   imageFile: File | null
  // ): Observable<any> {
  //   const url = `${this.baseUrl}/${id}`;
  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('description', description);
  //   formData.append('duration', duration.toString());
  //   formData.append('startDateTime', startDateTime);
  //   formData.append('category_id', categoryId.toString());
  //   if (imageFile) {
  //     formData.append('imageFile', imageFile);
  //   }

  //   return this.http.put<any>(url, formData)
  //     .pipe(catchError(this.handleError));
  // }

  updateCourse(id: number, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<any>(url, formData)
      .pipe(
        catchError(error => {
          console.error('Error updating course:', error);
          return throwError(error);
        })
      );
  }
  
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
