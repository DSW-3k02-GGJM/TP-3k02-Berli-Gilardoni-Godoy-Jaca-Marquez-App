// Angular
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.model';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  templateUrl: './vehicles-table.component.html',
  styleUrl: '../../../../shared/styles/genericTable.scss',
  imports: [
    CommonModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class VehiclesTableComponent {
  @Input() vehicles!: Vehicle[];
  @Input() errorMessage: string = '';

  @Output() vehicleDeleted = new EventEmitter<number>();

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
        title: 'Eliminar vehículo',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar el vehículo ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService.delete('vehicles', Number(id)).subscribe({
            next: () => {
              this.vehicleDeleted.emit(id);
              this.snackBarService.show(
                'El vehículo ha sido eliminado exitosamente'
              );
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar el vehículo');
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
        title: 'Error al eliminar el vehículo',
        message:
          'El vehículo no se puede eliminar porque tiene reservas asociadas.',
        haveRouterLink: false,
      },
    });
  }

  get filteredVehicles() {
    return this.vehicles.filter((vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  editVehicle(vehicle: Vehicle): void {
    this.router.navigate(['/staff/vehicles/' + vehicle.id]);
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.openDeleteDialog(vehicle.licensePlate, Number(vehicle.id));
  }
}
