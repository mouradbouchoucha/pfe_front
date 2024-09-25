import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-center-front',
  templateUrl: './center-front.component.html',
  styleUrls: ['./center-front.component.css']
})
export class CenterFrontComponent {

  isLoggedIn: boolean = false;

  constructor(
    private router: Router  
  ) {
    this.isLoggedIn = !!localStorage.getItem('token'); 
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    localStorage.removeItem('token'); // Example
    this.isLoggedIn = false;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
