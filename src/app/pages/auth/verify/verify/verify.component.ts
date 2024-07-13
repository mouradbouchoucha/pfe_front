import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log(token);
      if (token) {
        this.authService.verifyEmail(token).subscribe(
          response => {
            alert('Email verified successfully!');
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Verification error:', error); // Log the full error
            alert('Verification error: ' + error); // Show the error message in an alert
          }
        );
      }
    });
  }
}
