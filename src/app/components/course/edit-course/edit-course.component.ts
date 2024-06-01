import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/interfaces/course';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  courseForm: FormGroup;
  course: any | null = null;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      startDateTime: ['', Validators.required],
      imageFile: [null]
    });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(+courseId).subscribe(course => {
        this.course = course;
        this.courseForm.patchValue(course);
      });
    }
  }

  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.courseForm.patchValue({ imageFile: file });
  //   }
  // }

  onSubmit(): void {
    if (this.courseForm.valid && this.course) {
      const formData = new FormData();
      Object.keys(this.courseForm.controls).forEach(key => {
        formData.append(key, this.courseForm.get(key)?.value);
      });

      this.courseService.updateCourse(this.course.id!, formData).subscribe(() => {
        this.router.navigate(['/courses']);
      });
    }
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
}
