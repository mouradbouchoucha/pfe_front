import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isSignUpMode = false;

  switchToSignUp() {
    this.isSignUpMode = true;
  }

  switchToSignIn() {
    this.isSignUpMode = false;
  }

  onSignUp(event: Event) {
    event.preventDefault();
    // Logic for sign-up form submission
    console.log('Sign Up form submitted');
  }

  onSignIn(event: Event) {
    event.preventDefault();
    // Logic for sign-in form submission
    console.log('Sign In form submitted');
  }
}
