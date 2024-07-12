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
    console.log(this.data.startDateTime);
  
    // Adjust startDateTime for timezone offset
    const localStartDateTime = new Date(this.data.startDateTime);
    const timezoneOffset = localStartDateTime.getTimezoneOffset() * 60000; // Offset in milliseconds
    const adjustedStartDateTime = new Date(localStartDateTime.getTime() - timezoneOffset);
  
    this.scheduleForm = this.fb.group({
      course_id: [this.data.courseId],
      subject: ['', Validators.required],
      trainer: ['', Validators.required],
      startDateTime: [adjustedStartDateTime, Validators.required],
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
    console.log(this.data);
    this.scheduleService.getAvailableTrainers(this.data.startDateTime, this.data.duration).subscribe(
      trainer =>{
        this.trainers = trainer;
        console.log('trainers',this.trainers);
      }
    )
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const scheduleData = {
        ...this.scheduleForm.value,
        startDateTime: this.scheduleForm.value.startDateTime.toISOString()
      };

      console.log(scheduleData);
      this.scheduleService.createSchedule(scheduleData, this.data.courseId).subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          if (error.status === 409) {
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

  getFormattedDateTime(date: Date): string {
    const updatedDate = new Date(date.getTime() - 2 * 60 * 60 * 1000);

    return this.datePipe.transform(updatedDate, 'yyyy-MM-dd HH:mm') || '';
  }
}
