import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CenterService {

  private apiUrl = 'http://localhost:9090/api/centers/center';

  constructor(private http: HttpClient) { }

  getCenterDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
