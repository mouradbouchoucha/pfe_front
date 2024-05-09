import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category/category.service';
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {
  name!:string;
  description!:string;
  categoryForm!: FormGroup;
  selectedFile!:File | null;
  imagePreview!:string | ArrayBuffer | null;
  constructor(public dialogRef: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) categoryData: Category,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {  
    
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

  ngOnInit():void{
    this.categoryForm = this.fb.group({
      id: [null,[Validators.required]],
      name: [null,[Validators.required]],
      description: [null,[Validators.required]],
      imageFile: [null,[Validators.required]]
    });
  } 
  addCategory(): void {
    if ( this.selectedFile) {
      const name = this.categoryForm.get('name')?.value;
      const description = this.categoryForm.get('description')?.value;

      this.categoryService.createCategory(this.selectedFile,this.name, this.description, ).subscribe(
        (res) => {
          console.log(res);
          this.snackBar.open('Category Created Successfully', 'close', { duration: 3000 });
          this.categoryForm.reset();
          this.selectedFile = null;
        },
        (error) => {
          console.error('Error adding category:', error);
          this.snackBar.open('Failed to add category. Please try again.', 'Error', { duration: 5000 });
        }
      );
    } else {
      for (const i in this.categoryForm.controls) {
        this.categoryForm.controls[i].markAsDirty();
        this.categoryForm.controls[i].updateValueAndValidity();
      }
    }
  }
  }

