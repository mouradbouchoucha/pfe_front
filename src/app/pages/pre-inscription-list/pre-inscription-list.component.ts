import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-pre-inscription-list',
  templateUrl: './pre-inscription-list.component.html',
  styleUrls: ['./pre-inscription-list.component.css']
})
export class PreInscriptionListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'traineeId', 'courseId', 'status'];
  dataSource = new MatTableDataSource<any>([]); // Data source for the table
  enrollments: any[] = []; // Store the enrollment requests

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadEnrollmentRequests();
  }

  loadEnrollmentRequests(): void {
    this.enrollmentService.getPendingEnrollments().subscribe(
      (data: any[]) => {
        this.enrollments = data; // Store the fetched enrollments
        this.getTraineesAndCourses();
        console.log(this.dataSource.data); // Fetch trainees after loading enrollment requests
      },
      (error) => {
        console.error('Error fetching enrollment requests', error);
      }
    );
  }

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
                traineeName: trainee.firstName+' '+trainee.lastName, // Add trainee's name
                courseName: course.name // Add course's name
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
}
