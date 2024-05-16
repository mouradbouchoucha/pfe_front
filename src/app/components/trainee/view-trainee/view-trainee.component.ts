import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

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
    @Inject(MAT_DIALOG_DATA)public traineeData: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [{ value: this.traineeData.element.firstName, disabled: true }],
      lastName: [{ value: this.traineeData.element.lastName, disabled: true }],
      phoneNumber: [{ value: this.traineeData.element.phoneNumber, disabled: true }],
      email: [{ value: this.traineeData.element.email, disabled: true }],
      address: [{ value: this.traineeData.element.address, disabled: true }],
      city: [{ value: this.traineeData.element.city, disabled: true }]
    });
  }

  getImageUrl(imageData: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}
