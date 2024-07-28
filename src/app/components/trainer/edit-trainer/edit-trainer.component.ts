import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { TrainerService } from 'src/app/services/trainer/trainer.service';

@Component({
  selector: 'app-edit-trainer',
  templateUrl: './edit-trainer.component.html',
  styleUrls: ['./edit-trainer.component.css']
})
export class EditTrainerComponent implements OnInit {
  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview: string | ArrayBuffer | null = 'assets/haracter default avatar.png';

  constructor(
    public dialogRef: MatDialogRef<EditTrainerComponent>,
    @Inject(MAT_DIALOG_DATA) public trainerData: any,
    private trainerService: TrainerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.trainerData.element.firstName, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastName: [this.trainerData.element.lastName, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      phoneNumber: [this.trainerData.element.phoneNumber, [Validators.required,Validators.pattern(/^[0-9]{8}$/)]],
      institutionName: [this.trainerData.element.institutionName, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      departmentName: [this.trainerData.element.departmentName, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      yearsOfExperience: [this.trainerData.element.yearsOfExperience, [Validators.required,Validators.pattern(/^[0-9]{2}$/)]],
      degree: [this.trainerData.element.degree, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: [this.trainerData.element.email, [Validators.required, Validators.email]],
      address: [this.trainerData.element.address,[Validators.pattern(/^[a-zA-Z\s]+$/)]],
      city: [this.trainerData.element.city,[Validators.pattern(/^[a-zA-Z\s]+$/)]]

      
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

  updateTrainer() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Update Trainer',
      message: 'Are you sure you want to update this trainer?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(res => {
      if (res) {
        if (this.form.valid) {
          const { firstName, lastName, phoneNumber, institutionName,departmentName,yearsOfExperience,degree,email, address, city } = this.form.value;
          console.log('Updating Trainer:', { firstName, lastName, email, institutionName,degree,yearsOfExperience, phoneNumber, address, city });
          
          this.authService.checkEmail(email).subscribe((existsEmail)=>{
            if(existsEmail){
              this.trainerService.updateTrainer(this.trainerData.element.id, this.selectedFile, firstName, lastName, phoneNumber, institutionName,departmentName,yearsOfExperience,degree,email, address, city).subscribe(
                () => {
                  this.snackBar.open('Trainer Updated Successfully', 'close', { duration: 3000 });
                  this.dialogRef.close(true);
                },
                (error) => {
                  console.error('Error updating trainer:', error);
                  this.snackBar.open('Failed to update trainer. Please try again.', 'Error', { duration: 5000 });
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
