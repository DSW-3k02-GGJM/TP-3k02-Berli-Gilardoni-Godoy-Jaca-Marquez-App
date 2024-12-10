import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-validation-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './validation-dialog.component.html',
  styleUrl: './validation-dialog.component.scss'
})
export class ValidationDialogComponent {

}
