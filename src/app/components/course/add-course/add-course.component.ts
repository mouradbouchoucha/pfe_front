import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category/category.service';
import { CourseService } from 'src/app/services/course/course.service';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  form!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;
  categories!: any[];

  constructor(
    public dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public courseData: any,
    private courseService: CourseService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogService: DialogServiceService,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      startDateTime: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (res) => {
        this.categories = res;
      },
      (error) => {
        console.error('Error getting categories:', error);
      }
    );
  }

  addCourse(): void {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Add Course',
      message: 'Are you sure you want to add this course?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(result => {
      if (result) {
        if (this.form.valid  ) {
          const { name, description, duration, startDateTime, categoryId } = this.form.value;

          this.courseService.createCourse(
            this.selectedFile, name, description, duration, startDateTime, categoryId ).subscribe(
            (res) => {
              this.snackBar.open('Course Created Successfully', 'close', { duration: 3000 });
              this.form.reset();
              this.selectedFile = null;
              this.imagePreview = null;
              this.dialogRef.close();
            },
            (error) => {
              console.error('Error adding course:', error);
              this.snackBar.open('Failed to add course. Please try again.', 'Error', { duration: 5000 });
            }
          );
        } else {
          this.form.markAllAsTouched();
        }
      }
    });
  }
}
