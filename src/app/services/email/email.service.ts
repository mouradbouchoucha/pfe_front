import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:9090/api/email/send'; // URL to Spring Boot API

  constructor(private http: HttpClient) {}

  /**
   * Sends an email to multiple recipients with an optional attachment.
   * @param emails Comma-separated string of recipient email addresses.
   * @param subject Subject of the email.
   * @param message Body of the email.
   * @param attachment Optional file attachment.
   */
  sendEmail(emails: string, subject: string, message: string, attachment?: File): Observable<any> {
    const formData: FormData = new FormData();

    // Append email parameters to the form data
    formData.append('emails', emails);
    formData.append('subject', subject);
    formData.append('message', message);

    // If attachment is provided, append the file to form data
    if (attachment) {
      formData.append('attachment', attachment, attachment.name);
    }

    const headers = new HttpHeaders({
      'Accept':'text/plain'
    });

    return this.http.post(this.apiUrl, formData, { headers, responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
