// Angular
import { Injectable } from '@angular/core';

// Angular Material
import { MatSnackBar } from '@angular/material/snack-bar';

// Interfaces
import { SnackBar } from '@shared/interfaces/snack-bar.interface';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    } as SnackBar);
  }
}
