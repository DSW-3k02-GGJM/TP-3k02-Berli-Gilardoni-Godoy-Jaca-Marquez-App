// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { VehicleFilterPipe } from '@core/vehicle/pipes/vehicle-filter.pipe';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  templateUrl: './vehicles-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    VehicleFilterPipe,
    ActionButtonsComponent,
  ],
})
export class VehiclesTableComponent {
  @Input() vehicles: Vehicle[] = [];
  @Output() vehicleDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly vehicleApiService: VehicleApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  private openDeleteDialog(licensePlate: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'vehículo',
        message: `¿Está seguro de que desea eliminar el vehículo ${licensePlate}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.vehicleApiService.delete(id).subscribe({
            next: (response: Message) => this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: Message): void {
    this.vehicleDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
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

  getColorName(vehicle: Vehicle): string {
    return typeof vehicle.color === 'object' ? vehicle.color.colorName : '';
  }

  getLocationName(vehicle: Vehicle): string {
    return typeof vehicle.location === 'object'
      ? vehicle.location.locationName
      : '';
  }

  getVehicleModelName(vehicle: Vehicle): string {
    return typeof vehicle.vehicleModel === 'object'
      ? vehicle.vehicleModel.vehicleModelName
      : '';
  }

  private getLicensePlate(vehicle: ActionButtons): string {
    return 'licensePlate' in vehicle ? vehicle.licensePlate : '';
  }

  editVehicle(vehicle: ActionButtons): void {
    this.router.navigate([`/staff/vehicles/${vehicle.id}`]);
  }

  deleteVehicle(vehicle: ActionButtons): void {
    this.openDeleteDialog(this.getLicensePlate(vehicle), vehicle.id);
  }
}
