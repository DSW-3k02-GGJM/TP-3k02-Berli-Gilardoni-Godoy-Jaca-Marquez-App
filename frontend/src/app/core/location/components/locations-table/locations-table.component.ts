// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { LocationApiService } from '@core/location/services/location.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Location } from '@core/location/interfaces/location.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { LocationFilterPipe } from '@core/location/pipes/location-filter.pipe';

@Component({
  selector: 'app-locations-table',
  standalone: true,
  templateUrl: './locations-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    LocationFilterPipe,
    ActionButtonsComponent,
  ],
})
export class LocationsTableComponent {
  @Input() locations: Location[] = [];
  @Input() errorMessage: string = '';
  @Output() locationDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly locationApiService: LocationApiService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.dialog.open(GenericDialogComponent, {
        width: '350px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: {
          title: 'Eliminar sucursal',
          titleColor: 'danger',
          image: 'assets/generic/delete.png',
          message: `¿Está seguro de que desea eliminar la sucursal ${name}?`,
          showBackButton: true,
          backButtonTitle: 'Volver',
          mainButtonTitle: 'Eliminar',
          mainButtonColor: 'bg-danger',
          haveRouterLink: false,
        },
      } as GenericDialog);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.locationApiService.delete(id).subscribe({
            next: () => {
              this.locationDeleted.emit();
              this.snackBarService.show(
                'La sucursal ha sido eliminada correctamente'
              );
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog(error.error.message);
              } else {
                this.snackBarService.show('Error al eliminar la sucursal');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar la sucursal',
        titleColor: 'dark',
        image: 'assets/generic/wrongmark.png',
        message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredLocations(): Location[] {
    return this.locations.filter((location: Location) =>
      location.locationName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  getLocationName(location: ActionButtons): string {
    return 'locationName' in location ? location.locationName : '';
  }

  editLocation(location: ActionButtons): void {
    this.router.navigate([`/staff/locations/${location.id}`]);
  }

  deleteLocation(location: ActionButtons): void {
    this.openDeleteDialog(this.getLocationName(location), location.id);
  }
}
