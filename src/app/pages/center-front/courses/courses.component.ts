import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryService } from 'src/app/services/category/category.service';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  coursesByCategory: any;
  loading: boolean = true;
  showCourses: boolean = true;
  course: any;
  constructor(
    private categoryService: CategoryService,
    private coursesService: CourseService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.categoryService.getCoursesByCategory().subscribe(data => {
      this.coursesByCategory = data;
      this.loading = false;
      console.log(this.coursesByCategory);

    });
  }

  enroll(courseId: number): void {
    // this.coursesService.enrollInCourse(courseId).subscribe(response => {
    //   alert('Inscription réussie !');
    // });
  }

  viewCourse(courseId: number){
    this.showCourses = false;
    console.log(courseId);
    this.coursesService.getCourseById(courseId).subscribe(course => {
      this.course = course;
      console.log(this.course);
    });
  }

  getImageUrl(imageData: string) {
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/DefaultImage.png';
    }
  }
}
