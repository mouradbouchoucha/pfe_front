import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course/course.service';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  courseForm: FormGroup;
  course: any | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      startDateTime: ['', Validators.required],
      category_id: [null, Validators.required],
      imageFile: [null]
    });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    console.log(courseId);
    if (courseId) {
      this.courseService.getCourseById(+courseId).subscribe(course => {
        this.course = course;
        console.log(this.course);
        this.courseForm = this.fb.group({
          name: [this.course.name, Validators.required],
          description: [this.course.description, Validators.required],
          duration: [this.course.duration, Validators.required],
          startDateTime: [this.course.startDateTime, Validators.required],
          category_id: [this.course.category_id, Validators.required],
          imageFile: [this.course.imageFile]
        });
      });
    }

    this.loadCategories();
  }

  onSubmit(): void {
    if (this.courseForm.valid && this.course) {
      const formData = new FormData();
      formData.append('name', this.courseForm.get('name')?.value);
      formData.append('description', this.courseForm.get('description')?.value);
      formData.append('duration', this.courseForm.get('duration')?.value.toString());
      formData.append('startDateTime', new Date(this.courseForm.get('startDateTime')?.value).toISOString());
      formData.append('category_id', this.courseForm.get('category_id')?.value.toString());
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      this.courseService.updateCourse(this.course.id, formData).subscribe(() => {
         this.router.navigate(['/admin/courses/details',this.course.id]);
        console.log(formData);
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
