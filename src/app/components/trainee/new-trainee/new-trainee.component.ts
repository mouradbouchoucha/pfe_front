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
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;
  professions: string[] = ['Student','Engineer', 'Teacher', 'Developer']; 


  constructor(
    public dialogRef: MatDialogRef<NewTraineeComponent>,
    @Inject(MAT_DIALOG_DATA) traineeData: any,
    private traineeService: TraineeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService
  ) {

  }
  ngOnInit(): void {
    this.form = this.fb.group ({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required,],],
      email: [null, [Validators.required, ]],
      profession: [null, [Validators.required, ], ],
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
  saveTrainee() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Add Category',
      message: 'Are you sure you want to Add this category?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(res=>{
      if(res){
        if(this.form.valid && this.selectedFile){
          const firstName = this.form.get('firstName')?.value;
          const lastName = this.form.get('lastName')?.value;
          const email = this.form.get('email')?.value;
          const profession = this.form.get('profession')?.value;
          const phoneNumber = this.form.get('phoneNumber')?.value;
          const address = this.form.get('address')?.value;
          const city = this.form.get('city')?.value;
          console.log(this.form);
          console.log(this.selectedFile);
          this.traineeService.createTrainee(this.selectedFile, firstName, lastName, email,profession, phoneNumber, address, city).subscribe(
            (res) => {
              console.log(res);
              this.snackBar.open('Trainee Created Successfully', 'close', { duration: 3000 });
              
              this.form = this.fb.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', Validators.required],
                phoneNumber: ['', Validators.required],
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
        }else {
          for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
          }
        }
      }else {
        this.form.markAllAsTouched();
      }
    });
  }
}
