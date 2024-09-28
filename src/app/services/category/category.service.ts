import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from 'src/app/interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = 'http://localhost:9090/api/categories';
  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all_SortedByCreatedAt`);
  }

  getAllCategoriesByName(name:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/${name}`);
  }
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  createCategory(imageFile: File | null,name: string, description: string, ): Observable<any> {
    const formData = new FormData();
    if(imageFile){
      formData.append('imageFile', imageFile);
    }
    formData.append('name', name);
    formData.append('description', description);
    return this.http.post<any>(`${this.baseUrl}/create`, formData)
      
  }
  updateCategory(id: number, name: string, description: string, imageFile: File | null): Observable<any> {
    const url = `${this.baseUrl}/update/${id}`;
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put<any>(url, formData)
      .pipe(
        catchError(error => {
          console.error('Error updating category:', error);
          return throwError(error);
        })
      );
  }
  

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getCoursesByCategory(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/courses`);
  }
}
