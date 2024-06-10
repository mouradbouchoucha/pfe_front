import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ScheduleService } from 'src/app/services/schedule/schedule.service';
import { SubjectService } from 'src/app/services/subject/subject.service';
// import { SubjectService } from 'src/app/services/subject.service';
// import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.css'],
  providers: [DatePipe]
})
export class AddScheduleModalComponent implements OnInit {
  scheduleForm!: FormGroup;
  subjects: any[] = [];
  trainers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private scheduleService: ScheduleService,
     private subjectService: SubjectService,
    // private trainerService: TrainerService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadTrainers();
    console.log(this.data);
    const formattedStartDateTime = this.datePipe.transform(this.data.startDateTime, 'dd/MM/yyyy HH:mm');

    this.scheduleForm = this.fb.group({
      courseId: [this.data.courseId],
      subject: ['', Validators.required],
      trainer: ['', Validators.required],
      startDateTime: [formattedStartDateTime, Validators.required],
      duration: [this.data.duration, Validators.required],
      location: ['', Validators.required]
    });
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  loadTrainers(): void {
    this.scheduleService.getAvailableTrainers(this.data.startDateTime, this.data.duration).subscribe(
      trainer =>{
        this.trainers = trainer;
        console.log('trainers',this.trainers);
      }
    )
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      console.log(this.scheduleForm.value);
      this.scheduleService.createSchedule(this.scheduleForm.value).subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          if (error.status === 409) { // Assuming 409 Conflict is returned for overlapping schedules
            console.log('The selected time slot overlaps with an existing schedule. Please choose a different time.');
          } else {
            console.error('Error creating schedule:', error);
          }
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
