import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-edit-category-madal',
  templateUrl: './edit-category-madal.component.html',
  styleUrls: ['./edit-category-madal.component.css']
})
export class EditCategoryMadalComponent {
category!:any;

 selectedFile!:File |null;
 imagePreview!:string | ArrayBuffer | null;
 
 nameControl: FormControl; 
 descriptionControl: FormControl;
constructor(private categoryService: CategoryService,
  public dialogRef: MatDialogRef<EditCategoryMadalComponent>,
  @Inject(MAT_DIALOG_DATA) data: any,
  private domSanitizer: DomSanitizer,
  private snackBar: MatSnackBar,
  
){
  this.category=data;
  this.nameControl = new FormControl(this.category.name, [Validators.required]);
    this.descriptionControl = new FormControl(this.category.description, [Validators.required]);
}

updateCategory(): void {
  if (this.nameControl.invalid || this.descriptionControl.invalid) {
    this.snackBar.open('Please fill in all required fields.', 'Error', { duration: 3000 });
    return;
  }
  this.categoryService.updateCategory(this.category.id, this.category.name, this.category.description, this.selectedFile)
      .subscribe(
        (response) => {
          console.log('Category updated successfully:', response);
          this.dialogRef.close();
          this.snackBar.open('Category Updated Successfully', 'close', { duration: 3000 });
        },
        (error) => {
          console.error('Error updating category:', error);
          this.snackBar.open('Failed to update category. Please try again.', 'Error', { duration: 5000 });

        }
      );
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

  getImageUrl(imageData: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
  }
}
