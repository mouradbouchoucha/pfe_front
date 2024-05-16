import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogConfirmComponent } from 'src/app/components/dialog-confirm/dialog-confirm.component';
import { ConfirmDialogData } from 'src/app/interfaces/confirm-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

  constructor(private dialog:MatDialog) { }

  confirmDialog(data: ConfirmDialogData):Observable<boolean> {
    return this.dialog.open(DialogConfirmComponent,{
      data,
      width: '400px',
      height: '200px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'confirm-dialog-container',
      autoFocus: false,
    }).afterClosed()
  }
}
