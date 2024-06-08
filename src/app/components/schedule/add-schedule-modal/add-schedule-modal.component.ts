import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
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
    // private subjectService: SubjectService,
    // private trainerService: TrainerService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadTrainers();

    const formattedStartDateTime = this.datePipe.transform(this.data.startDateTime, 'dd/MM/yyyy HH:mm');

    this.scheduleForm = this.fb.group({
      subject: ['', Validators.required],
      trainer: ['', Validators.required],
      startDateTime: [formattedStartDateTime, Validators.required],
      duration: [this.data.duration, Validators.required],
      location: ['', Validators.required]
    });
  }

  loadSubjects(): void {
    // this.subjectService.getSubjects().subscribe(subjects => {
    //   this.subjects = subjects;
    // });
  }

  loadTrainers(): void {
    // this.trainerService.getTrainers().subscribe(trainers => {
    //   this.trainers = trainers;
    // });
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      this.dialogRef.close(this.scheduleForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
