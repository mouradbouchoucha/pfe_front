import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  baseUrl = 'http://localhost:9090/api/trainers';

  constructor(private http: HttpClient) { }

  getAllTrainers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }
  
  getAllTrainerByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/${name}`);
  }

  getTrainerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createTrainer(
    imageFile: File,
    firstName: string,
    lastName: string,
    email: string,
    institutionName: string,
    departmentName: string,
    yearsOfExperience: number,
    degree: string,
    phoneNumber: string,
    address: string,
    city: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('profilePictureFile', imageFile);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('institutionName', institutionName);
    formData.append('departmentName', departmentName);
    formData.append('yearsOfExperience', yearsOfExperience.toString());
    formData.append('degree', degree);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('city', city);

    return this.http.post<any>(`${this.baseUrl}/create`, formData);
  }

  updateTrainer(
    id: number,
    imageFile: File | null,
    firstName: string,
    lastName: string,
    email: string,
    institutionName: string,
    departmentName: string,
    yearsOfExperience: number,
    degree: string,
    phoneNumber: string,
    address: string,
    city: string
  ): Observable<any> {
    const url = `${this.baseUrl}/update/${id}`;
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('institutionName', institutionName);
    formData.append('departmentName', departmentName);
    formData.append('yearsOfExperience', yearsOfExperience.toString());
    formData.append('degree', degree);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('city', city);

    if (imageFile) {
      formData.append('profilePictureFile', imageFile);
    }

    return this.http.put<any>(url, formData).pipe(
      catchError(error => {
        console.error('Error updating trainer:', error);
        return throwError(error);
      })
    );
  }

  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
