import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { CourseService } from 'src/app/services/course/course.service';
import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-pre-inscription-list',
  templateUrl: './pre-inscription-list.component.html',
  styleUrls: ['./pre-inscription-list.component.css']
})
export class PreInscriptionListComponent implements OnInit {
  displayedColumns: string[] = [' ', 'traineeId', 'courseId', 'status', '  '];
  dataSource = new MatTableDataSource<any>([]); // Data source for the table
  enrollments: any[] = []; // Store the enrollment requests

  all: boolean = true;
  pending: boolean = false;
  approved: boolean = false;
  rejected: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEnrollmentRequests(); // Load all enrollment requests by default
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Toggling functions
  toggleAll() {
    this.resetFilters();
    this.all = true;
    this.loadEnrollmentRequests();
  }

  togglePending() {
    this.resetFilters();
    this.pending = true;
    this.loadEnrollmentRequests();
  }

  toggleApproved() {
    this.resetFilters();
    this.approved = true;
    this.loadEnrollmentRequests();
  }

  toggleRejected() {
    this.resetFilters();
    this.rejected = true;
    this.loadEnrollmentRequests();
  }

  // Reset filters before applying a new one
  resetFilters() {
    this.all = false;
    this.pending = false;
    this.approved = false;
    this.rejected = false;
  }

  // Load enrollment requests based on the selected filter
  loadEnrollmentRequests(): void {
    let fetchObservable;

    if (this.pending) {
      fetchObservable = this.enrollmentService.getPendingEnrollments();
    } else if (this.approved) {
      fetchObservable = this.enrollmentService.getApprovedEnrollments();
    } else if (this.rejected) {
      fetchObservable = this.enrollmentService.getRejectedEnrollments();
    } else {
      fetchObservable = this.enrollmentService.getAllEnrollments(); // Default to all pending
    }

    fetchObservable.subscribe(
      (data: any[]) => {
        this.enrollments = data; // Store the fetched enrollments
        this.getTraineesAndCourses();
      },
      (error) => {
        console.error('Error fetching enrollment requests', error);
      }
    );
  }

  // Fetch trainees and courses and attach to the enrollments
  getTraineesAndCourses(): void {
    const enrollmentWithDetails: any[] = []; // Explicitly declare the array type

    this.enrollments.forEach((element) => {
      // Fetch Trainee details
      this.traineeService.getTraineeById(element.traineeId).subscribe(
        (trainee: any) => {
          // Fetch Course details after Trainee details
          this.courseService.getCourseById(element.courseId).subscribe(
            (course: any) => {
              const enrollmentWithDetail = {
                ...element, // Spread enrollment data
                traineePhoto: trainee.profilePicture,
                traineeName: trainee.firstName + ' ' + trainee.lastName, // Add trainee's name
                courseName: course.name // Add course's name,
              };
              enrollmentWithDetails.push(enrollmentWithDetail); // Add to the new array

              // Update the table's data source
              this.dataSource.data = enrollmentWithDetails;
            },
            (error) => {
              console.error('Error fetching course', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching trainee', error);
        }
      );
    });
  }

  approveEnrollment(id: number) {
    const enrollment = this.enrollments.find(e => e.id === id);
    if (enrollment) {
      this.traineeService.getTraineeById(enrollment.traineeId).subscribe(
        (trainee: any) => {
          this.courseService.getCourseById(enrollment.courseId).subscribe(
            (course: any) => {
              // After fetching both trainee and course, approve the enrollment
              this.enrollmentService.approveEnrollment(id).subscribe(() => {
                this.snackBar.open(
                  `${trainee.firstName} ${trainee.lastName}'s enrollment in ${course.name} has been approved.`,
                  'Close',
                  { duration: 5000 ,
                    panelClass: 'custom-snackbar'
                  },
                  
                );
                this.loadEnrollmentRequests(); // Reload the data after approval
              });
            },
            (error) => {
              console.error('Error fetching course', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching trainee', error);
        }
      );
    }
  }

  // Reject enrollment with snackbar message
  rejectEnrollment(id: number) {
    const enrollment = this.enrollments.find(e => e.id === id);
    if (enrollment) {
      this.traineeService.getTraineeById(enrollment.traineeId).subscribe(
        (trainee: any) => {
          this.courseService.getCourseById(enrollment.courseId).subscribe(
            (course: any) => {
              // Display snackbar after fetching trainee and course
              this.snackBar.open(
                `${trainee.firstName} ${trainee.lastName}'s enrollment in ${course.name} has been rejected.`,
                'Close',
                { 
                  duration: 5000 ,
                  panelClass: ['error-snackbar']
                }
              );
              console.log('Enrollment rejected with ID:', id);
            },
            (error) => {
              console.error('Error fetching course', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching trainee', error);
        }
      );
    }
  }
  getImageUrl(imageData: string) {
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/haracter default avatar.png';
    }
  }
}
