import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  searchForm!: FormGroup;
  like!: boolean;
constructor(
  private fb: FormBuilder,
){

}

ngOnInit(): void {
  this.searchForm = this.fb.group({
    title: [null,]
  });
}
openModal() {}
submitForm() {}
likeToggle() {
  this.like = !this.like;
}
}
