import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { JwtAuthenticationResponse } from 'src/app/interfaces/jwtAuthenticationResponse';
import { SignInRequest } from 'src/app/interfaces/sign-in-request';
import { SignUpRequest } from 'src/app/interfaces/sign-up-request';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated:boolean=false;
accessToken!:string;
username!:string;
roles:any;

  baseUrl = 'http://localhost:9090/api/auth';
  constructor(private http: HttpClient,private router: Router) { }

  signIn(signInRequest: SignInRequest):Observable<JwtAuthenticationResponse> { 
    return this.http.post<JwtAuthenticationResponse>(`${this.baseUrl}/signin`, signInRequest);
  }
  signUp(signUpRequest: SignUpRequest):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/signup`, signUpRequest);
  }
//   logout() {
//     localStorage.removeItem('accessToken'); // Remove access token
//     // Optionally clear other session data
//     this.router.navigateByUrl('/login'); // Redirect to login page
//   }
//   loadProfile(data: any) {
//     console.log(data);
//     this.isAuthenticated = true;

//     this.accessToken = data['accessToken'];
//     //console.log(this.accessToken);
//     let decodeJwt:any = jwtDecode(this.accessToken);// librairie jwtDecode
//     //console.log(decodeJwt);
//     this.username = decodeJwt.sub;
//     //console.log(this.username);
//     this.roles=decodeJwt.roles;
//     //console.log(this.roles[0]);
//     //console.log(decodeJwt);
//     return {'roles':decodeJwt.roles['roles']}
// }
logout() {
  localStorage.removeItem('accessToken');
  this.isAuthenticated = false;
  this.accessToken = '';
  this.username = '';
  this.roles = null;
  this.router.navigateByUrl('/login');
}

loadProfile(data: JwtAuthenticationResponse) {
  this.isAuthenticated = true;
  this.accessToken = data['accessToken'];
  const decodedToken:any = jwtDecode(this.accessToken);
  this.username = decodedToken.sub;
  this.roles = decodedToken.roles || []; // Handle potential missing roles field
  return; // No need to return anything
}
checkEmail(email: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseUrl}/verify_email?email=${email}`);
}

verifyEmail(token: string) {
  return this.http.get(`${this.baseUrl}/auth/verify?token=${token}`);
}
}
