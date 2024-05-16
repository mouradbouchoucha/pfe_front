import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignInRequest } from 'src/app/interfaces/sign-in-request';
import { SignUpRequest } from 'src/app/interfaces/sign-up-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  newPassword: string = '';
  newEmail: string = ''


  constructor(private authService: AuthService, private router: Router) { }

  async onSignIn() {

    const signInRequest: SignInRequest = {
      email: this.email,
      password: this.password
    };
    console.log(signInRequest);
    this.authService.signIn(signInRequest).subscribe(
      data => {
        console.log(data);
        localStorage.setItem('token', JSON.stringify(data));
        this.authService.loadProfile(data);
        console.log(this.authService.loadProfile(data));
        console.log(this.authService.roles);
        if (this.authService.roles.includes('ADMIN')) {
          console.log('Admin');
          this.router.navigateByUrl('/admin');

        } else if (this.authService.roles.includes('TRAINER')) {
          this.router.navigateByUrl('/trainer');
        } else if (this.authService.roles == 'USER') {
          this.router.navigateByUrl('/user');
        }else {
          this.router.navigateByUrl('');
        }
      }
    );
  }
  onSignUp() {
    const signUpRequest: SignUpRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.newEmail,
      password: this.newPassword
    };
    console.log(signUpRequest);
    this.authService.signUp(signUpRequest).subscribe(
      data => {
        console.log(data);
        // this.onSignIn();
        //this.router.navigateByUrl('');
        const signInRequest: SignInRequest = {
          email: this.newEmail,
          password: this.newPassword
        };
        console.log(signInRequest);
        this.authService.signIn(signInRequest).subscribe(
          data => {
            console.log(data);
            this.authService.loadProfile(data);
            this.router.navigateByUrl('');
          }
        );
      }
    );
  }



}

