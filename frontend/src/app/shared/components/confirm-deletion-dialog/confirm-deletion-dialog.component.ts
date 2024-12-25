// Angular
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-deletion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
  ],
  templateUrl: './confirm-deletion-dialog.component.html',
  styleUrls: [
    './confirm-deletion-dialog.component.scss',
    '../../styles/genericDialog.scss',
  ],
})
export class ConfirmDeletionDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
