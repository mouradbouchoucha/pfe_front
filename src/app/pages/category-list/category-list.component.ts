import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NewCategoryComponent } from 'src/app/components/new-category/new-category.component';
import { CategoryService } from 'src/app/services/category/category.service';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
categories:any[] = [];
showModal: boolean = false;
searchForm!:FormGroup;
constructor(
  private categoryService: CategoryService,
  public domSanitizer: DomSanitizer,
  public dialog: MatDialog,
  private fb: FormBuilder,
  private dialogService : DialogServiceService
  
){
 
}

  ngOnInit(): void {
    this.loadCategories();
    //console.log(this.categories);
    this.searchForm = this.fb.group({
      title: [null,]
    });
  }
  loadCategories(): void {
    this.categoryService.getAllCategories()
    .subscribe(
       res=>{
        
        this.categories = res;
        console.log(this.categories);
       },
      
    )
  }
openModal(): void {
  this.showModal = true;
  const dialogRef = this.dialog.open(NewCategoryComponent);
  dialogRef.afterClosed().subscribe(result => {
    this.loadCategories();
    this.showModal = false;
  });
} 
onCategoryDeleted(): void {
  this.loadCategories();
}
onCategoryUpdated(): void {
  console.log('Category updated');
  this.loadCategories();
}

submitForm() {
  const title = this.searchForm.get('title')?.value;
  if(title) {
    this.categoryService.getAllCategoriesByName(title).subscribe(
      res=>{
        if(res.length > 0) {
          this.categories = res.map(
            element =>({
              ...element,
              processedImg: 'data:image/png;base64'+ element.image,
            }))
          }else{
            this.dialogService.confirmDialog({
              title: 'Search Result',
              message: 'No result matches your search',
              cancelText: 'OK'
            }).subscribe()
          }
      }
    )
}}
}
