import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-deletion-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './confirm-deletion-dialog.component.html',
  styleUrl: '../../styles/genericDialog.scss'
})
export class ConfirmDeletionDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
