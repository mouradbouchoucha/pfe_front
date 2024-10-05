import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-view-trainee',
  templateUrl: './view-trainee.component.html',
  styleUrls: ['./view-trainee.component.css']
})
export class ViewTraineeComponent {
  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;


  constructor(
    public dialogRef: MatDialogRef<ViewTraineeComponent>,
    @Inject(MAT_DIALOG_DATA) public traineeData: any,
    private fb: FormBuilder,
    public common: CommonMethodService) {
    console.log(traineeData);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [{ value: this.traineeData.element.firstName, disabled: true }],
      lastName: [{ value: this.traineeData.element.lastName, disabled: true }],
      phoneNumber: [{ value: this.traineeData.element.phoneNumber, disabled: true }],
      profession: [{ value: this.traineeData.profession, disabled: true }],
      email: [{ value: this.traineeData.element.email, disabled: true }],
      address: [{ value: this.traineeData.element.address, disabled: true }],
      city: [{ value: this.traineeData.element.city, disabled: true }]
    });
  }



  onNoClick(): void {
    this.dialogRef.close();
  }


}
