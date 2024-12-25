// Angular
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

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
  selector: 'app-generic-success-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './generic-success-dialog.component.html',
  styleUrls: [
    './generic-success-dialog.component.scss',
    '../../styles/genericDialog.scss',
  ],
})
export class GenericSuccessDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  constructor(public router: Router) {}
}
