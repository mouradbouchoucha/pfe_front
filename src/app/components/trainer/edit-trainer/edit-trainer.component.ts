import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  imagePreview!: string | ArrayBuffer | null;


  constructor(
    public dialogRef: MatDialogRef<EditTrainerComponent>,
    @Inject(MAT_DIALOG_DATA)public trainerData: any,
    private trainerService: TrainerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService
  ) {

  }
  ngOnInit(): void {
    console.log(this.trainerData);
    this.form = this.fb.group ({
      firstName: [this.trainerData.element.firstName, [Validators.required]],
      lastName: [this.trainerData.element.lastName, [Validators.required]],
      phoneNumber: [this.trainerData.element.phoneNumber, [Validators.required,],],
      email: [this.trainerData.element.email, [Validators.required, ]],
      address: [this.trainerData.element.address],
      city: [this.trainerData.element.city],
      
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
  updateTrainer() {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Update Trainer',
      message: 'Are you sure you want to update this trainer?',
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
          this.trainerService.updateTrainer(this.trainerData.element.id,this.selectedFile, firstName, lastName, email, phoneNumber, address, city).subscribe(
            (res) => {
              // console.log(res);
              this.snackBar.open('Trainer Created Successfully', 'close', { duration: 3000 });
              
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
              console.error('Error updating trainer:', error);
              this.snackBar.open('Failed to update trainer. Please try again.', 'Error', { duration: 5000 });
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
