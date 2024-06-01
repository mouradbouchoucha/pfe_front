import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { EditCategoryMadalComponent } from '../edit-category-madal/edit-category-madal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { ConfirmDialogData } from 'src/app/interfaces/confirm-dialog-data';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css']
})
export class CategoryCardComponent {
@Input('category') category!:any ;
@Output() categoryDeleted: EventEmitter<void> = new EventEmitter<void>();
@Output() categoryUpdated: EventEmitter<any> = new EventEmitter<any>();

showModal:boolean = false;
constructor(
  private domSanitizer :DomSanitizer,
  private categoryService:CategoryService,
  public dialog:MatDialog,
  private snackBar:MatSnackBar,
  private dialogService:DialogServiceService
){}
getImageUrl(imageData: string) {
  if (imageData) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
  } else {
    return 'assets/DefaultImage.png';
  }
}
deleteCategory(id: number): void {
  const confirmationDialog = this.dialogService.confirmDialog({
    title: 'Delete Category',
    message: 'Are you sure you want to delete this category?',
    confirmText: 'Yes',
    cancelText: 'No',
  });

  confirmationDialog.subscribe(confirmed => {
    if (confirmed) {
      this.categoryService.deleteCategory(id)
        .subscribe(() => {
          // Filter out the deleted category from the list
          this.snackBar.open('Category deleted successfully', 'Close', {
            duration: 3000,
          });
          this.categoryDeleted.emit();
        }, error => {
          console.error('Error deleting category:', error);
          // Handle error
        });
    }
  });
}

openEditModal(category:Category):void{
  this.showModal=true;
  const dialogRef = this.dialog.open(EditCategoryMadalComponent,{
    data:category
  });
  dialogRef.afterClosed().subscribe(() => {          
    this.categoryUpdated.emit();
  }
  )
}
}
