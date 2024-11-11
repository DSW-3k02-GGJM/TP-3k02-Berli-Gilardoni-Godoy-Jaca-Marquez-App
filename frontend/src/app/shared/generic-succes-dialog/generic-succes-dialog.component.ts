import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generic-succes-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule
  ],
  templateUrl: './generic-succes-dialog.component.html',
  styleUrl: './generic-succes-dialog.component.scss'
})
export class GenericSuccesDialogComponent{
  
  data = inject(MAT_DIALOG_DATA);

  constructor(
    public router: Router
  ) {}

}