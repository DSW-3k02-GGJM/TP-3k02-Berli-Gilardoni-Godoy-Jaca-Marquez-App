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
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Pipes
import { VehicleFilterPipe } from '@core/vehicle/pipes/vehicle-filter.pipe';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  templateUrl: './vehicles-table.component.html',
  styleUrl: '../../../../shared/styles/genericTable.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    VehicleFilterPipe,
  ],
})
export class VehiclesTableComponent {
  @Input() vehicles: Vehicle[] = [];
  @Input() errorMessage: string = '';
  @Output() vehicleDeleted = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly vehicleApiService: VehicleApiService,
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
          title: 'Eliminar vehículo',
          titleColor: 'danger',
          image: 'assets/delete.png',
          message: `¿Está seguro de que desea eliminar el vehículo ${name}?`,
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
          this.vehicleApiService.delete(id).subscribe({
            next: () => {
              this.vehicleDeleted.emit();
              this.snackBarService.show(
                'El vehículo ha sido eliminado exitosamente'
              );
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog(error.error.message);
              } else {
                this.snackBarService.show('Error al eliminar el vehículo');
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
        title: 'Error al eliminar el vehículo',
        titleColor: 'dark',
        image: 'assets/wrongmark.png',
        message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredVehicles(): Vehicle[] {
    return this.vehicles.filter((vehicle: Vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  getBrandName(vehicle: Vehicle): string {
    return typeof vehicle.vehicleModel?.brand === 'object'
      ? vehicle.vehicleModel?.brand.brandName
      : '';
  }

  getVehicleModelName(vehicle: Vehicle): string {
    return typeof vehicle.vehicleModel === 'object'
      ? vehicle.vehicleModel.vehicleModelName
      : '';
  }

  getColorName(vehicle: Vehicle): string {
    return typeof vehicle.color === 'object' ? vehicle.color.colorName : '';
  }

  getLocationName(vehicle: Vehicle): string {
    return typeof vehicle.location === 'object'
      ? vehicle.location.locationName
      : '';
  }

  editVehicle(vehicle: Vehicle): void {
    this.router.navigate([`/staff/vehicles/${vehicle.id}`]);
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.openDeleteDialog(vehicle.licensePlate, vehicle.id);
  }
}
