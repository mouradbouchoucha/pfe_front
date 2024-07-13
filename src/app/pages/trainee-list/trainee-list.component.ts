import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { EditTraineeComponent } from 'src/app/components/trainee/edit-trainee/edit-trainee.component';
import { NewTraineeComponent } from 'src/app/components/trainee/new-trainee/new-trainee.component';
import { ViewTraineeComponent } from 'src/app/components/trainee/view-trainee/view-trainee.component';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { TraineeService } from 'src/app/services/trainee/trainee.service';

@Component({
  selector: 'app-trainee-list',
  templateUrl: './trainee-list.component.html',
  styleUrls: ['./trainee-list.component.css']
})
export class TraineeListComponent {
  trainees!: any[];
  showModal: boolean = false;
  searchForm!: FormGroup;

  displayedColumns: string[] = ['  ', '   ', 'name', 'E-mail', ' '];
  dataSource = new MatTableDataSource<any>(this.trainees);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private traineeService: TraineeService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogService: DialogServiceService,
    private snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer

  ) {

  }
  ngOnInit(): void {
    this.loadTrainees();
    this.searchForm = this.fb.group({
      title: [null,]
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTrainees() {
    this.traineeService.getAllTrainees().subscribe(
      data => {
        this.trainees = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = this.trainees;
        console.log(this.trainees);
      },
      error => {
        console.log(error);
      }
    )
  }
  getImageUrl(imageData: string) {
    if (imageData) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${imageData}`);
    } else {
      return 'assets/haracter default avatar.png';
    }
  }
  openAddModal(): void {
    this.showModal = true;
    const dialogRef = this.dialog.open(NewTraineeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.loadTrainees();
      this.showModal = false;
    });
  }

  submitForm() {
    const title = this.searchForm.get('title')?.value;
    if(title) {
      this.traineeService.getAllTraineeByName(title).subscribe(
        res => {
          if(res.length > 0) {
            this.trainees = res.map(element=>
              (
                {
                  ...element,
                  processedImg: 'data:image/png;base64'+ element.image
                }
            ))
            this.dataSource.data = this.trainees;
          }else{
            this.dialogService.confirmDialog({
              title: 'No Result Found',
              message: 'No Result Found',
              cancelText: 'Ok',
            }).subscribe()
          }
        })
    }else{
      this.loadTrainees()
    }
  }

  openViewDialog(element: any) {
    const dialogRef = this.dialog.open(ViewTraineeComponent, {
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openEditDialog(element: any) {
    const dialogRef = this.dialog.open(EditTraineeComponent, {
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTrainees();
      this.showModal = false;
    });
  }
  deleteTrainee(id: number) {
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Delete Trainee',
      message: 'Are you sure you want to delete this trainee?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    confirmationDialog.subscribe(confirmed => {
      if (confirmed) {
        this.traineeService.deleteTrainee(id)
          .subscribe(() => {
            // Filter out the deleted category from the list
            this.snackBar.open(`Trainee deleted successfully`, 'Close', {
              duration: 3000,
            });
            this.loadTrainees();
          }, error => {
            console.error('Error deleting Trainee:', error);
            // Handle error
          });
      }
    });
  }
}
