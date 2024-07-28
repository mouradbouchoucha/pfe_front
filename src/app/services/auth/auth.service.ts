import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { JwtAuthenticationResponse } from 'src/app/interfaces/jwtAuthenticationResponse';
import { SignInRequest } from 'src/app/interfaces/sign-in-request';
import { SignUpRequest } from 'src/app/interfaces/sign-up-request';
import { catchError } from 'rxjs/operators';


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

verifyEmail(token: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/verify`, { params: { token } })
    .pipe(
      catchError(this.handleError)
    );
}

private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'An unknown error occurred';
  if (error.status === 400) {
    if (error.error === 'Invalid token') {
      errorMessage = 'The verification token is invalid. Please check the token and try again.';
    } else if (error.error === 'Token expired') {
      errorMessage = 'The verification token has expired. Please request a new verification email.';
    }
  } else if (error.status === 500) {
    errorMessage = 'Server error, please try again later.';
  }
  return throwError(errorMessage);
}

}
