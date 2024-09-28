import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AddCourseComponent } from 'src/app/components/course/add-course/add-course.component';
import { CourseService } from 'src/app/services/course/course.service';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  searchForm!: FormGroup;
  like!: boolean;
  courses!:any[];
constructor(
  private fb: FormBuilder,
  private courseService: CourseService,
  private domSanitizer: DomSanitizer,
  private dialog:MatDialog,
  private dialogService: DialogServiceService,
  private snackBar: MatSnackBar
){

}

ngOnInit(): void {
  this.searchForm = this.fb.group({
    title: [null,]
  });
  this.loadCourses()
}

loadCourses(){
  this.courseService.getAllCourses()
   .subscribe(
      res=>{
        this.courses = res;
        console.log(this.courses);
      },
      err=>{
        console.log(err);
      }
    );
}
getImageUrl(imageData: string) {
  if (imageData) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
  } else {
    // Replace 'default-image.png' with the actual path to your default image in the assets folder
    return 'assets/DefaultImage.png';
  }
}

openModal() {
  const dialogRef = this.dialog.open(AddCourseComponent);
  dialogRef.afterClosed().subscribe(result => {
    this.loadCourses();
  });
}
submitForm() {
  const title = this.searchForm.get('title')?.value;

  if (title) {
    this.courseService.getAllCourseByName(title).subscribe(
      res => {
        if (res.length > 0) {
          this.courses = res.map(element => ({
            ...element,
            processedImg: `data:image/png;base64,${element.image}`
          }));
        } else {
          this.dialogService.confirmDialog({
            title: 'Search Result',
            message: 'No result matches your search',
            cancelText: 'OK'
          }).subscribe(
            
          );
          this.loadCourses()
          this.searchForm.reset();
        }
      },
      error => {
        console.error('Error fetching courses:', error);
        // Optionally, show an error message to the user
      }
    );
  }else{
    this.loadCourses();
  }
}

likeToggle() {
  this.like = !this.like;
}
deleteCourse(id:number){
  const confirmationDialog = this.dialogService.confirmDialog({
    title: 'Delete Course',
    message: 'Are you sure you want to delete this Course?',
    confirmText: 'Yes',
    cancelText: 'No',
  });

  confirmationDialog.subscribe(confirmed => {
    if (confirmed) {
      this.courseService.deleteCourse(id)
        .subscribe(() => {
          // Filter out the deleted category from the list
          this.snackBar.open(`Course deleted successfully`, 'Close', {
            duration: 3000,
          });
          this.loadCourses();
        }, error => {
          console.error('Error deleting Course:', error);
          // Handle error
        });
    }
  });

}
}
  
