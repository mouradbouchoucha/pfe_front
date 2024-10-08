import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule/schedule.service';
import { SubjectService } from 'src/app/services/subject/subject.service';
import { TrainerService } from 'src/app/services/trainer/trainer.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-schedule-modal',
  templateUrl: './edit-schedule-modal.component.html',
  styleUrls: ['./edit-schedule-modal.component.css'],
  providers: [DatePipe]
})
export class EditScheduleModalComponent implements OnInit {
  scheduleForm!: FormGroup;
  subjects!: any[];
  trainers!: any[];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private subjectService: SubjectService,
    private trainerService: TrainerService,
    private dialogRef: MatDialogRef<EditScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    console.log("data",this.data.id);
    this.scheduleForm = this.fb.group({
      subject: [this.data.subject, Validators.required],
      trainer: [this.data.trainer, Validators.required],
      startDateTime: [this.data.start, Validators.required],
      duration: [this.data.duration, Validators.required],
      location: [this.data.location, Validators.required]
    });

    // Load subjects and trainers for the dropdowns
    this.loadSubjectsAndTrainers();
  }

  private loadSubjectsAndTrainers(): void {
    this.subjectService.getAllSubjects().subscribe(
      subjects => {
        this.subjects = subjects;
        this.loadSchedule();
      },
      error => console.error('Error fetching subjects', error)
    );

    this.trainerService.getAllTrainers().subscribe(
      trainers => {
        this.trainers = trainers;
        this.loadSchedule();
      },
      error => console.error('Error fetching trainers', error)
    );
  }

  private loadSchedule(): void {
    console.log(typeof(Number(this.data.id)));
    this.scheduleService.getScheduleById(Number(this.data.id)).subscribe(
      schedule => {
        console.log('Schedule loaded:', schedule);
        const formattedStartDateTime = this.datePipe.transform(schedule.startDateTime, 'dd/MM/yyyy HH:mm');
        this.scheduleForm.patchValue({
          subject: schedule.subject.id,
          trainer: schedule.trainer.id,
          startDateTime: formattedStartDateTime,
          duration: schedule.duration,
          location: schedule.location
        });
      },
      error => {
        console.error('Error fetching schedule', error);
      }
    );
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const updatedSchedule = {
        ...this.scheduleForm.value,
        id: this.data.id
      };
      console.log(updatedSchedule);
      this.scheduleService.updateSchedule(this.data.id, updatedSchedule).subscribe(
        () => {
          this.dialogRef.close(updatedSchedule);
        },
        error => {
          console.error('Error updating schedule', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
