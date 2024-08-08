import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrl: './confirm-deletion.component.scss',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogModule],
})
export class ConfirmDeletionComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
