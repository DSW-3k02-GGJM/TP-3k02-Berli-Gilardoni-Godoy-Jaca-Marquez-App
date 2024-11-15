import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-generic-error-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './generic-error-dialog.component.html',
  styleUrl: './generic-error-dialog.component.scss'
})
export class GenericErrorDialogComponent {

  data = inject(MAT_DIALOG_DATA);

  constructor(
    public router: Router
  ) {}
}
