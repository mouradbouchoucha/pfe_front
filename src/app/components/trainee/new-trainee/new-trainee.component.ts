import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-new-trainee',
  templateUrl: './new-trainee.component.html',
  styleUrls: ['./new-trainee.component.css']
})
export class NewTraineeComponent implements OnInit {
  form!: FormGroup;
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = 'assets/haracter default avatar.png';
  professions: string[] = ['Student', 'Engineer', 'Teacher', 'Developer']; 

  constructor(
    public dialogRef: MatDialogRef<NewTraineeComponent>,
    @Inject(MAT_DIALOG_DATA) public traineeData: any,
    private traineeService: TraineeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: [null, [Validators.required, Validators.email]],
      profession: [null, [Validators.required]],
      address: [null],
      city: [null],
    });
    this.setDefaultFile();
  }

  setDefaultFile() {
    // Set the default file from the assets
    fetch('assets/haracter default avatar.png')
      .then(res => res.blob())
      .then(blob => {
        this.selectedFile = new File([blob], 'character_default_avatar.png', { type: 'image/png' });
        this.previewImage();
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTrainee() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Add Trainee',
      message: 'Are you sure you want to add this trainee?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(res => {
      if (res) {
        if (this.form.valid) {
          const firstName = this.form.get('firstName')?.value;
          const lastName = this.form.get('lastName')?.value;
          const email = this.form.get('email')?.value;
          const profession = this.form.get('profession')?.value;
          const phoneNumber = this.form.get('phoneNumber')?.value;
          const address = this.form.get('address')?.value;
          const city = this.form.get('city')?.value;

          this.traineeService.createTrainee(
            this.selectedFile,
            firstName,
            lastName,
            email,
            profession,
            phoneNumber,
            address,
            city
          ).subscribe(
            (res) => {
              console.log(res);
              this.snackBar.open('Trainee Created Successfully', 'close', { duration: 3000 });
              this.dialogRef.close(true); // Optionally pass data to the parent component
            },
            (error) => {
              console.error('Error adding trainee:', error);
              this.snackBar.open('Failed to add trainee. Please try again.', 'Error', { duration: 5000 });
            }
          );
        } else {
          this.form.markAllAsTouched();
        }
      }
    });
  }
}
