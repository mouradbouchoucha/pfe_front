import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { EditTrainerComponent } from 'src/app/components/trainer/edit-trainer/edit-trainer.component';
import { NewTrainerComponent } from 'src/app/components/trainer/new-trainer/new-trainer.component';
import { ViewTrainerComponent } from 'src/app/components/trainer/view-trainer/view-trainer.component';
import { DialogServiceService } from 'src/app/services/dialog/dialog-service.service';
import { TrainerService } from 'src/app/services/trainer/trainer.service';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.component.html',
  styleUrls: ['./trainer-list.component.css']
})
export class TrainerListComponent implements OnInit {
  
  trainers!:any[];
  showModal:boolean=false;
  searchForm!:FormGroup;

  displayedColumns: string[] = [ '  ','   ','name', 'E-mail',' '];
  dataSource = new MatTableDataSource<any>(this.trainers);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private trainerService: TrainerService,
    private dialog:MatDialog,
    private fb: FormBuilder,
    private dialogService: DialogServiceService,
    private snackBar:MatSnackBar,
   private domSanitizer: DomSanitizer

  ){

  }
  ngOnInit(): void {
    this.loadTrainers();
    this.searchForm = this.fb.group({
      title: [null,]
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTrainers(){
    this.trainerService.getAllTrainers().subscribe(
      data => {
        this.trainers = data;
        this.dataSource.data = this.trainers;
        console.log(this.trainers);
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
    const dialogRef = this.dialog.open(NewTrainerComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.loadTrainers();
      this.showModal = false;
    });
  } 

  submitForm() {
    const title = this.searchForm.get('title')?.value;
    if(title) {
      this.trainerService.getAllTrainerByName(title).subscribe(
        res => {
          console.log(res);
          if(res.length >0){
            this.trainers = res.map(
              element=>({
                ...element,
                processedImg: 'data:image/png;base64'+ element.image
              })
            )
            this.dataSource.data = this.trainers;
          }else{
            this.dialogService.confirmDialog({
              title: 'No Result',
              message: 'No Trainer found with this name',
              cancelText: 'Ok',
            })
          }
        }
      )
    }
  }

  openViewDialog(element:any){
    const dialogRef = this.dialog.open(ViewTrainerComponent,{
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  
  openEditDialog(element:any) {
    const dialogRef = this.dialog.open(EditTrainerComponent,{
      data: { element: element } 
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTrainers();
      this.showModal = false;
    });
  }
  deleteTrainer(id: number){
    const confirmationDialog = this.dialogService.confirmDialog({
      title: 'Delete Trainer',
      message: 'Are you sure you want to delete this trainer?',
      confirmText: 'Yes',
      cancelText: 'No',
    });
  
    confirmationDialog.subscribe(confirmed => {
      if (confirmed) {
        this.trainerService.deleteTrainer(id)
          .subscribe(() => {
            // Filter out the deleted category from the list
            this.snackBar.open(`Trainer deleted successfully`, 'Close', {
              duration: 3000,
            });
            this.loadTrainers();
          }, error => {
            console.error('Error deleting Trainer:', error);
            // Handle error
          });
      }
    });
  }

}
