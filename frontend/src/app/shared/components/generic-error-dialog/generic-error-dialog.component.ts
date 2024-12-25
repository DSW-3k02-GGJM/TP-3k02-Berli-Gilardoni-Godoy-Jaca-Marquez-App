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
  selector: 'app-generic-error-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
  ],
  templateUrl: './generic-error-dialog.component.html',
  styleUrls: [
    './generic-error-dialog.component.scss',
    '../../styles/genericDialog.scss',
  ],
})
export class GenericErrorDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  constructor(public router: Router) {}
}
