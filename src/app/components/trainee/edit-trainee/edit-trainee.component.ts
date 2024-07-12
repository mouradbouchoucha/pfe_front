import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-edit-trainee',
  templateUrl: './edit-trainee.component.html',
  styleUrls: ['./edit-trainee.component.css']
})
export class EditTraineeComponent implements OnInit {
  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview: string | ArrayBuffer | null = 'assets/haracter default avatar.png';
  professions: string[] = ['Student', 'Engineer', 'Teacher', 'Developer'];

  constructor(
    public dialogRef: MatDialogRef<EditTraineeComponent>,
    @Inject(MAT_DIALOG_DATA) public traineeData: any,
    private traineeService: TraineeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Trainee Data:', this.traineeData);
    this.form = this.fb.group({
      firstName: [this.traineeData.element.firstName, [Validators.required]],
      lastName: [this.traineeData.element.lastName, [Validators.required]],
      phoneNumber: [this.traineeData.element.phoneNumber, [Validators.required]],
      email: [this.traineeData.element.email, [Validators.required, Validators.email]],
      profession: [this.traineeData.element.profession, [Validators.required]],
      address: [this.traineeData.element.address],
      city: [this.traineeData.element.city]
    });
  }

  setDefaultFile() {
    fetch('assets/character_default_avatar.png')
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

  updateTrainee() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Update Trainee',
      message: 'Are you sure you want to update this trainee?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(res => {
      if (res) {
        if (this.form.valid) {
          const { firstName, lastName, email, profession, phoneNumber, address, city } = this.form.value;
          console.log('Updating Trainee:', { firstName, lastName, email, profession, phoneNumber, address, city });
          
          this.authService.checkEmail(email).subscribe((emailExist)=>{
            if(emailExist) {
              this.traineeService.updateTrainee(this.traineeData.element.id, this.selectedFile, firstName, lastName, email, profession, phoneNumber, address, city).subscribe(
                () => {
                  this.snackBar.open('Trainee Updated Successfully', 'close', { duration: 3000 });
                  this.dialogRef.close(true);
                },
                (error) => {
                  console.error('Error updating trainee:', error);
                  this.snackBar.open('Failed to update trainee. Please try again.', 'Error', { duration: 5000 });
                }
              ); 
            }
          })
          
        } else {
          this.form.markAllAsTouched();
        }
      }
    });
  }
}
