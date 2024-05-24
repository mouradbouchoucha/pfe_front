import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit {
  course!: any;
  constructor(private route: ActivatedRoute,
    private courseService: CourseService,
    private domSanitizer: DomSanitizer,
    private dialog:MatDialog,
  )
     {
     }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getCourseDetails(id);
    }
    console.log(this.course);
  }

  getCourseDetails(id: string): void {
    this.courseService.getCourseById(parseInt(id)).subscribe(course => {
      this.course = course;
      console.log(course);
    }, error => {
      console.error('Error fetching course details:', error);
    });
  }

  getImageUrl(imageData: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
  }
}
