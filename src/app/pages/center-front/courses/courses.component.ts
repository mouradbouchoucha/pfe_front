import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CategoryService } from 'src/app/services/category/category.service';
import { CourseService } from 'src/app/services/course/course.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  coursesByCategory: any;
  loading: boolean = true;
  showCourses: boolean = true;
  course: any;
  traineeId!:number;

  token = localStorage.getItem('token');
   user:any = JSON.parse(localStorage.getItem('token')!);
   userData:any = jwtDecode(this.user['accessToken']);


  constructor(
    private categoryService: CategoryService,
    private coursesService: CourseService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private traineeService: TraineeService,
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCoursesByCategory().subscribe(data => {
      this.coursesByCategory = data;
      this.loading = false;
      console.log(this.coursesByCategory);

    });
    this.getUser()
  }


  getUser() {
    let email: any; 
    
    if (localStorage.getItem('token')) {
      console.log(this.userData);
      
      if (this.userData && this.userData.sub) {
        email = this.userData.sub; 
      }
    }
  
    if (email) {
      this.traineeService.getTraineeByEmail(email).subscribe(data => {
        this.traineeId = data.id;
        console.log(this.traineeId);
        }, error => {
        console.error('Error fetching trainee data', error);
      });
    } else {
      console.error('Email not found, cannot fetch trainee data');
    }
  }
  
  viewCourse(courseId: number){
    this.showCourses = false;
    console.log(courseId);
    this.coursesService.getCourseById(courseId).subscribe(course => {
      this.course = course;
      console.log(this.course);
    });
  }

  getImageUrl(imageData: string) {
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/DefaultImage.png';
    }
  }

  enroll(courseId: number): void {
    
    if(localStorage.getItem('token') == null){
      alert('Veuillez vous connecter pour vous inscrire à ce cours');
      this.router.navigateByUrl('/login')
    }else{
      console.log('enrolled in Course'+courseId);
    }
    
    this.enrollmentService.createEnrollment({courseId:courseId,traineeId:this.traineeId}).subscribe(response => {
      this.router.navigateByUrl('/courses');
      this.router.navigateByUrl('')
    });
  }
}
