import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MenubarComponent } from '../menubar/menubar.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
 
})
export class AdminDashboardComponent implements OnInit {

  constructor(private router: Router) { }
  ngOnInit(): void {
   this.redirect()

}

redirect(){
  const token = localStorage.getItem('token');
  const user:any = JSON.parse(localStorage.getItem('token')!);
  const userData:any = jwtDecode(user['accessToken']);
  console.log(userData.roles);
  if(userData.roles.includes('ADMIN')){
    console.log('admin');
  }else{
    this.router.navigateByUrl('/user');
}
}

scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}

