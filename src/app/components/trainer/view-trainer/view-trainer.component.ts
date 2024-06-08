import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-view-trainer',
  templateUrl: './view-trainer.component.html',
  styleUrls: ['./view-trainer.component.css']
})
export class ViewTrainerComponent {
  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;
  sanitizedImageUrl!:any;

  constructor(
    public dialogRef: MatDialogRef<ViewTrainerComponent>,
    @Inject(MAT_DIALOG_DATA)public trainerData: any,
    private fb: FormBuilder,
    public common: CommonMethodService
    ) {
      // this.sanitizedImageUrl = this.common.getImageUrl(this.trainerData.image, 'assets/character default avatar.png');
      // console.log(this.sanitizedImageUrl);
  }
  ngOnInit(): void {
    this.sanitizedImageUrl = this.common.getImageUrl(this.trainerData.image, 'assets/character default avatar.png');

    this.form = this.fb.group({
      firstName: [{ value: this.trainerData.element.firstName, disabled: true }],
      lastName: [{ value: this.trainerData.element.lastName, disabled: true }],
      phoneNumber: [{ value: this.trainerData.element.phoneNumber, disabled: true }],
      email: [{ value: this.trainerData.element.email, disabled: true }],
      
      address: [{ value: this.trainerData.element.address, disabled: true }],
      city: [{ value: this.trainerData.element.city, disabled: true }]
    });
  }

 

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}
