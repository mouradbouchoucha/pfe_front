import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { TrainerService } from 'src/app/services/trainer/trainer.service';

@Component({
  selector: 'app-new-trainer',
  templateUrl: './new-trainer.component.html',
  styleUrls: ['./new-trainer.component.css']
})
export class NewTrainerComponent implements OnInit {

  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;


  constructor(
    public dialogRef: MatDialogRef<NewTrainerComponent>,
    @Inject(MAT_DIALOG_DATA) trainerData: any,
    private trainerService: TrainerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService,
    public common: CommonMethodService
  ) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required,],],
      email: [null, [Validators.required,]],
      institutionName: [null, [Validators.required,]],
      departementName: [null, [Validators.required]],
      yearsOfExperience: [null, [Validators.required]],
      degree: [null],
      address: [null],
      city: [null],

    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
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
  saveTrainer() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Add Category',
      message: 'Are you sure you want to Add this category?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(res => {
      if (res) {
        if (this.form.valid && this.selectedFile) {
          const firstName = this.form.get('firstName')?.value;
          const lastName = this.form.get('lastName')?.value;
          const email = this.form.get('email')?.value;
          const institutionName = this.form.get('institutionName')?.value;
          const departementName = this.form.get('departementName')?.value;
          const yearsOfExperience = this.form.get('yearsOfExperience')?.value;
          const degree = this.form.get('degree')?.value;
          const phoneNumber = this.form.get('phoneNumber')?.value;
          const address = this.form.get('address')?.value;
          const city = this.form.get('city')?.value;
          console.log(this.form);
          console.log(this.selectedFile);
          this.trainerService.createTrainer(
            this.selectedFile,
            firstName,
            lastName,
            email,
            institutionName,
            departementName,
            yearsOfExperience,
            degree,
            phoneNumber,
            address,
            city).subscribe(
              (res) => {
                console.log(res);
                this.snackBar.open('Trainer Created Successfully', 'close', { duration: 3000 });

                this.form = this.fb.group({
                  firstName: ['', Validators.required],
                  lastName: ['', Validators.required],
                  email: ['', Validators.required],
                  phoneNumber: ['', Validators.required],
                  institutionName: ['', Validators.required],
                  departementName: ['', Validators.required],
                  yearsOfExperience: ['', Validators.required],
                  degree: [''],
                  address: [''],
                  city: [''],
                });
                this.form.markAsUntouched()
                this.selectedFile = null;
              },
              (error) => {
                console.error('Error adding category:', error);
                this.snackBar.open('Failed to add category. Please try again.', 'Error', { duration: 5000 });
              }
            )
        } else {
          for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
          }
        }
      } else {
        this.form.markAllAsTouched();
      }
    });
  }

}
