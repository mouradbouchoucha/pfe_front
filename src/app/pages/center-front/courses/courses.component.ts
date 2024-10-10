import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CategoryService } from 'src/app/services/category/category.service';
import { CourseService } from 'src/app/services/course/course.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  coursesByCategory: any;
  loading: boolean = true;
  showCourses: boolean = true;
  showDetails: boolean = false;
  course: any;
  traineeId!: number;

  token = localStorage.getItem('token');
  user: any = JSON.parse(localStorage.getItem('token')!);
  userData: any = jwtDecode(this.user['accessToken']);

  isLoading = false;

  constructor(
    private categoryService: CategoryService,
    private coursesService: CourseService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private traineeService: TraineeService,
    private enrollmentService: EnrollmentService,
    private dialogService: DialogServiceService,
    private snackBar: MatSnackBar,
    private zone: NgZone,
    private location: Location,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.categoryService.getCoursesByCategory().subscribe(data => {
      this.coursesByCategory = data;
      this.loading = false;
      //console.log(this.coursesByCategory);
    });
    this.getUser()
  }

  ngAfterViewInit() {

  }



  goBack(): void {
    // this.location.back();
    this.showCourses = true;
    this.showDetails = false
  }
  getUser() {
    let email: any;

    if (localStorage.getItem('token')) {
      //console.log(this.userData);

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

  viewCourse(courseId: number) {
    this.showCourses = false;
    this.showDetails = true;
    //console.log(courseId);
    this.coursesService.getCourseById(courseId).subscribe(course => {
      this.course = course;
      //console.log(this.course);
    });
  }

  getImageUrl(imageData: string) {
    //console.log(imageData);
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/DefaultImage.png';
    }
  }


  enroll(courseId: number): void {
    // Check if the user is logged in
    if (!localStorage.getItem('token')) {
      this.dialogService.confirmDialog({
        title: 'Enrollment',
        message: 'Please log in to enroll in this course.',
        cancelText: 'Cancel',
        confirmText: 'Login'
      }).subscribe(

        () => {
          this.router.navigateByUrl('/login');
        }

      )
    } else {
      // Check the enrollment status for the given course
      this.enrollmentService.checkEnrollmentStatus(courseId, this.traineeId).subscribe(
        response => {
          if (response.status === 'APPROVED') {
            // 
            this.dialogService.confirmDialog({
              title: 'Enrollment',
              message: 'You have already enrolled in this course.',
              cancelText: 'OK'
            }).subscribe(() => {
              // this.zone.run(() => this.router.navigateByUrl('/'));
            });
          } else if (response.status === 'PENDING') {
            this.dialogService.confirmDialog({
              title: 'Enrollment',
              message: 'Your enrollment request is pending. Do you want to proceed with enrollment?',
              cancelText: 'Cancel',
              confirmText: 'Proceed'
            }).subscribe(confirmed => {
              if (confirmed) {
                // this.enrollmentService.cancelPendingEnrollment(courseId, this.traineeId).subscribe(() => {
                //   this.createEnrollment(courseId);
                // });
              }
            });
          } else {
            // If no enrollment exists, create a new one
            this.createEnrollment(courseId);
          }
        },
        error => {
          this.snackBar.open(`Error checking enrollment status: ${error.message}`, 'Close', { duration: 3000 });
          console.error('Error checking enrollment status', error);
        }
      );
    }
  }

  // createEnrollment(courseId: number): void {
  //   this.isLoading = true;
  //   this.enrollmentService.createEnrollment({ courseId, traineeId: this.traineeId }).subscribe(
  //     {
  //       next: (response) => {
  //         this.isLoading = false;
  //         this.snackBar.open('Enrollment successful.', 'Close', { duration: 2000 });
  //         this.dialogService.confirmDialog({
  //           title: 'Enrollment',
  //           message: 'You have successfully enrolled in the course.',
  //           cancelText: 'OK'
  //         }).subscribe(() => {
  //           this.zone.run(() => this.router.navigateByUrl('/'));
  //         });
  //       }

  //     },
  //     // error => {
  //     //   this.isLoading = false;

  //     //   this.dialogService.confirmDialog({
  //     //     title: 'Enrollment',
  //     //     message: `${error}`,
  //     //     cancelText: 'OK'
  //     //   })

  //     //   console.error('Error during enrollment', error);
  //     // }

  //     error: (errorResponse) => {
  //       this.isLoading = false;
  //       if (error.status === 409) {
  //         // Handle conflict error (Trainee already enrolled)
  //         this.snackBar.open('You have already enrolled in this course.', '', {
  //           duration: 3000,
  //         });
  //       } else {
  //         // Handle other errors
  //         this.snackBar.open('An error occurred during enrollment.', '', {
  //           duration: 3000,
  //         });
  //       }
  //     },
  //   );
  // }


  createEnrollment(courseId: number) {
    this.isLoading = true;
    this.enrollmentService.createEnrollment({courseId,traineeId:this.traineeId}).subscribe({
      next: (response) => {
    this.isLoading=false;
    this.dialogService.confirmDialog({
      title: 'Enrollment',
      message: 'You have successfully enrolled in the course.',
      cancelText: 'OK'
    }).subscribe(() => {
      this.zone.run(() => this.router.navigateByUrl('/'));
    });
      },
      error: (errorResponse) => {
           //   this.isLoading = false;
        this.dialogService.confirmDialog({
          title: 'Enrollment',
          message: `${errorResponse}`,
          cancelText: 'OK'
        })

        console.error('Error during enrollment', errorResponse);
      },
    });
  }




}
