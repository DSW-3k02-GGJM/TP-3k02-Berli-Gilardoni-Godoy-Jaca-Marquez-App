// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-validation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
  ],
  templateUrl: './validation-dialog.component.html',
  styleUrl: './validation-dialog.component.scss',
})
export class ValidationDialogComponent {}
