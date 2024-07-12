import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  baseUrl = 'http://localhost:9090/api/trainees';
  constructor(private http: HttpClient) { }

  getAllTrainees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getAllTraineeByName(name:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/${name}`);
  }
  getTraineeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createTrainee(
                  imageFile: File | null,
                  firstName: string,
                  lastName: string,
                  email:string,
                  profession:string,
                  phoneNumber:string,
                  address:string,
                  city:string,
                  ): Observable<any> {
    const formData = new FormData();
    
    if (imageFile) {
      formData.append('profilePictureFile', imageFile);
    }
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('profession', profession);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('city', city);
    return this.http.post<any>(`${this.baseUrl}/create`, formData)
      
  }
  updateTrainee(  id: number,
                  imageFile: File | null, 
                  firstName: string,      
                  lastName: string,
                  email: string,
                  profession:string,
                  phoneNumber:string,
                  address:string,
                  city:string
              ): Observable<any> {
    const url = `${this.baseUrl}/update/${id}`;
    const formData = new FormData();
    
    formData.append('firstName',firstName);
    formData.append('lastName', lastName);
    formData.append('email',email);
    formData.append('profession',profession);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('city', city);
  
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
  

  deleteTrainee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
