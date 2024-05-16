import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { CdkDialogContainer } from '@angular/cdk/dialog';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {
  constructor(private authService:AuthService, 
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const requiredRole = route.data['role'];
      console.log(requiredRole); // Assuming a 'role' property on the route definition
      const userRoles = this.authService.roles;
      console.log(userRoles); // Access user roles from your AuthService
      return userRoles && userRoles.includes(requiredRole);
      

  }
  
}
