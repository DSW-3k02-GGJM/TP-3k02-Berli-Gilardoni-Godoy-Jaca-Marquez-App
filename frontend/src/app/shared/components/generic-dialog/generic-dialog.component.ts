// Angular
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
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

// Interfaces
import { DialogData } from '@shared/interfaces/generic-dialog.interface';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  templateUrl: './generic-dialog.component.html',
  styleUrls: [
    './generic-dialog.component.scss',
    '../../styles/genericDialog.scss',
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
  ],
})
export class GenericDialogComponent implements OnDestroy {
  data: DialogData = inject(MAT_DIALOG_DATA);

  constructor(private readonly router: Router) {}

  ngOnDestroy(): void {
    if (this.data.haveRouterLink) {
      this.router.navigate([this.data.goTo]);
    }
  }

  getAltText(imagePath: string): string {
    const fileName: string = imagePath.split('/').pop() || '';
    return fileName.split('.')[0];
  }
}
