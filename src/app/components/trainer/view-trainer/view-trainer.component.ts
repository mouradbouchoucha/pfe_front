import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-trainer',
  templateUrl: './view-trainer.component.html',
  styleUrls: ['./view-trainer.component.css']
})
export class ViewTrainerComponent {
  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;


  constructor(
    public dialogRef: MatDialogRef<ViewTrainerComponent>,
    @Inject(MAT_DIALOG_DATA)public trainerData: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [{ value: this.trainerData.element.firstName, disabled: true }],
      lastName: [{ value: this.trainerData.element.lastName, disabled: true }],
      phoneNumber: [{ value: this.trainerData.element.phoneNumber, disabled: true }],
      email: [{ value: this.trainerData.element.email, disabled: true }],
      address: [{ value: this.trainerData.element.address, disabled: true }],
      city: [{ value: this.trainerData.element.city, disabled: true }]
    });
  }

  getImageUrl(imageData: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}
