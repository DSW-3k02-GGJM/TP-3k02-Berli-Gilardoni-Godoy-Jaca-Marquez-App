import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-marca-confirm-deletion',
  templateUrl: './marca-confirm-deletion.component.html',
  styleUrl: './marca-confirm-deletion.component.scss',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogModule],
})
export class MarcaConfirmDeletionComponent {
  constructor(
    public dialogRef: MatDialogRef<MarcaConfirmDeletionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
