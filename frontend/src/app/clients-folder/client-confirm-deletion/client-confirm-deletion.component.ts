import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-client-confirm-deletion',
  templateUrl: './client-confirm-deletion.component.html',
  styleUrl: './client-confirm-deletion.component.scss',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogModule],
})
export class ClientConfirmDeletionComponent {
  constructor(
    public dialogRef: MatDialogRef<ClientConfirmDeletionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
