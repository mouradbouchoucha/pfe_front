import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent {
   token = localStorage.getItem('token');
   user:any = JSON.parse(localStorage.getItem('token')!);
   userData:any = jwtDecode(this.user['accessToken']);
   role:any = this.userData['roles'];
  constructor(private authService : AuthService){console.log(this.role);}
  logout():void{
    this.authService.logout();
    this.authService.isAuthenticated = false;
    this.authService.accessToken = '';
    this.authService.username = '';
    this.authService.roles = '';
    this.authService.isAuthenticated = false;
    localStorage.removeItem('token');
  }
}
