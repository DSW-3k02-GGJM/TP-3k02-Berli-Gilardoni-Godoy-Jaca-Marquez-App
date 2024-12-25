// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ConfirmDeletionDialogComponent } from '@shared/components/confirm-deletion-dialog/confirm-deletion-dialog.component';
import { GenericErrorDialogComponent } from '@shared/components/generic-error-dialog/generic-error-dialog.component';

// Pipes
import { FilterPipe } from '@shared/pipes/filter/filter.pipe';

@Component({
  selector: 'app-colors-table',
  standalone: true,
  templateUrl: './colors-table.component.html',
  styleUrls: [
    '../../../../shared/styles/genericSearchInput.scss',
    '../../../../shared/styles/genericTable.scss',
  ],
  imports: [
    CommonModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class ColorsTableComponent {
  @Input() colors!: any[];
  @Input() errorMessage: string = '';
  @Output() colorDeleted = new EventEmitter<number>();

  filterRows: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Eliminar color',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar el color ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService.delete('colors', Number(id)).subscribe({
            next: () => {
              this.colorDeleted.emit(id);
              this.snackBarService.show(
                'El color ha sido eliminado exitosamente'
              );
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar el color');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar el color',
        message:
          'El color no se puede eliminar porque tiene vehículos asociados.',
        haveRouterLink: false,
      },
    });
  }

  get filteredColors() {
    return this.colors.filter((color) =>
      color.colorName.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  editColor(color: any): void {
    this.router.navigate(['/staff/colors/' + color.id]);
  }

  deleteColor(color: any): void {
    this.openDeleteDialog(color.colorName, color.id);
  }
}
