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
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService
  ) {}

  ngOnInit(): void {
    this.loadEnrollmentRequests();
  }

  loadEnrollmentRequests(): void {
    this.enrollmentService.getPendingEnrollments().subscribe(
      (data: any[]) => {
        console.log(data);
        this.dataSource.data = data; // Update the dataSource with the fetched data
      },
      (error) => {
        console.error('Error fetching enrollment requests', error);
      }
    );
  }

  getTrainee(id:number){
    return this.traineeService.getTraineeById(id).subscribe(
      (trainee:any) => {
        console.log(trainee);
      }
    )
  }
}
