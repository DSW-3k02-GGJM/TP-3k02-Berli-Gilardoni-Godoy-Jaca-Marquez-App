// Angular Core
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
  selector: 'app-locations-table',
  standalone: true,
  templateUrl: './locations-table.component.html',
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
export class LocationsTableComponent {
  @Input() locations!: any[];
  @Input() errorMessage: string = '';
  @Output() locationDeleted = new EventEmitter<number>();

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
        title: 'Eliminar sucursal',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar la sucursal ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService.delete('locations', Number(id)).subscribe({
            next: () => {
              this.locationDeleted.emit(id);
              this.snackBarService.show(
                'La sucursal ha sido eliminada exitosamente'
              );
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar la sucursal');
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
        title: 'Error al eliminar la sucursal',
        message:
          'La sucursal no se puede eliminar porque tiene vehiculos asociados.',
        haveRouterLink: false,
      },
    });
  }

  get filteredLocations() {
    return this.locations.filter((location) =>
      location.locationName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  editLocation(location: any): void {
    this.router.navigate(['/staff/locations/' + location.id]);
  }

  deleteLocation(location: any): void {
    this.openDeleteDialog(location.locationName, location.id);
  }
}
