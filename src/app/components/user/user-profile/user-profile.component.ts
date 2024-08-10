import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtAuthenticationResponse } from 'src/app/interfaces/jwtAuthenticationResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  accessToken!:string  ;
  username!:string;
  token!:JwtAuthenticationResponse | null ;
  trainee!:any ;
    constructor(
    private traineeService : TraineeService,
    private authService : AuthService
  ){
    const tokenString = localStorage.getItem("token");

    // Parse the tokenString to the expected type
    if (tokenString) {
      this.token = JSON.parse(tokenString) as JwtAuthenticationResponse;
      this.accessToken = this.token.accessToken;
      console.log(this.token);
  
      const decodedToken: any = jwtDecode(this.accessToken);
      
      this.username = decodedToken.sub;
      console.log("decoded token", this.username);
    } else {
      this.token = null;
      this.accessToken = '';
      this.username = '';
    }
    this.traineeService.getTraineeByEmail(this.username).subscribe(
      user=>{
        this.trainee = user;
        console.log(this.username);
        console.log(this.trainee, user);
      }
    )
  }

}
