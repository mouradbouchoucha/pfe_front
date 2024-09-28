import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatSnackBar } from "@angular/material/snack-bar"
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {
  name!: string;
  description!: string;
  categoryForm!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;
  

  nameControl!: FormControl;
  descriptionControl!: FormControl;
  constructor(public dialogRef: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) categoryData: any,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService
  ) {
       this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
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

  ngOnInit(): void {
    // this.categoryForm = this.fb.group({
    //   id: [null,[Validators.required]],
    //   name: [null,[Validators.required]],
    //   description: [null,[Validators.required]],
    //   imageFile: [null,[Validators.required]]
    // });
  }
  addCategory(): void {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Add Category',
      message: 'Are you sure you want to Add this category?',
      confirmText: 'Yes',
      cancelText: 'No',
    });
    confirmationDialog.subscribe(result => {
      if(result){
        if (this.categoryForm.valid ) {
          const name = this.categoryForm.get('name')?.value;
          const description = this.categoryForm.get('description')?.value;
          const imageFile = this.selectedFile
          console.log(imageFile);
          this.categoryService.createCategory(this.selectedFile, name, description,).subscribe(
            (res) => {
              console.log(res);
              this.snackBar.open('Category Created Successfully', 'close', { duration: 3000 });
              // this.name = '';
              // this.description = '';
              // this.categoryForm = this.fb.group({
              //   name: ['', Validators.required],
              //   description: ['', Validators.required]
              //});
              // this.categoryForm.markAsUntouched() 
              this.selectedFile = null;
              this.dialogRef.close()
            },
            (error) => {
              console.error('Error adding category:', error);
              this.snackBar.open('Failed to add category. Please try again.', 'Error', { duration: 5000 });
            }
          );
        } else {
          // for (const i in this.categoryForm.controls) {
          //   this.categoryForm.controls[i].markAsDirty();
          //   this.categoryForm.controls[i].updateValueAndValidity();
          // }
        }
      }else {
        // this.categoryForm.markAllAsTouched();
      }
    })
  }
}

