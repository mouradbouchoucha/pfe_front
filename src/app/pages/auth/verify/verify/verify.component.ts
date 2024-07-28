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
      if (token) {
        this.authService.verifyEmail(token).subscribe(
          response => {
            console.log("Verification successful:", response);
            // Delay before navigating to /login
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 7000); // 7000 milliseconds = 7 seconds
          },
          error => {
            console.error('Verification error:', error); // Log the full error
            // Optionally, display error message to the user
            //alert(error);
            // Delay before navigating to /login
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 7000); // 7000 milliseconds = 7 seconds
          }
        );
      }
    });
  }
}
