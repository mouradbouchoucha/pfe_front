import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  imagePreview!: string | ArrayBuffer | null;


  constructor(
    public dialogRef: MatDialogRef<EditTraineeComponent>,
    @Inject(MAT_DIALOG_DATA)public traineeData: any,
    private traineeService: TraineeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService
  ) {

  }
  ngOnInit(): void {
    console.log(this.traineeData);
    this.form = this.fb.group ({
      firstName: [this.traineeData.element.firstName, [Validators.required]],
      lastName: [this.traineeData.element.lastName, [Validators.required]],
      phoneNumber: [this.traineeData.element.phoneNumber, [Validators.required,],],
      email: [this.traineeData.element.email, [Validators.required, ]],
      address: [this.traineeData.element.address],
      city: [this.traineeData.element.city],
      
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
  updateTrainee() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Update Trainee',
      message: 'Are you sure you want to update this trainee?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(res=>{
      if(res){
        // console.log('hhhhhhhhhhhhhhhhhh');

        if(this.form.valid){
          const firstName = this.form.get('firstName')?.value;
          const lastName = this.form.get('lastName')?.value;
          const email = this.form.get('email')?.value;
          const phoneNumber = this.form.get('phoneNumber')?.value;
          const address = this.form.get('address')?.value;
          const city = this.form.get('city')?.value;
          console.log(this.form);
          console.log(this.selectedFile);
          this.traineeService.updateTrainee(this.traineeData.element.id,this.selectedFile, firstName, lastName, email, phoneNumber, address, city).subscribe(
            (res) => {
              // console.log(res);
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
              console.error('Error updating trainee:', error);
              this.snackBar.open('Failed to update trainee. Please try again.', 'Error', { duration: 5000 });
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
