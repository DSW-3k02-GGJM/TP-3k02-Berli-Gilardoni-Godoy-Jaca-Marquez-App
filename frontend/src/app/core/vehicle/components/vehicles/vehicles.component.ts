// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { VehiclesTableComponent } from '@core/vehicle/components/vehicles-table/vehicles-table.component';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import { VehiclesResponse } from '@core/vehicle/interfaces/vehicles-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, VehiclesTableComponent],
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(
    private readonly vehicleApiService: VehicleApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onVehicleDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.vehicleApiService.getAll().subscribe({
      next: (response: VehiclesResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: VehiclesResponse): void {
    this.vehicles = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newVehicle(): void {
    this.router.navigate(['/staff/vehicles/create']);
  }
}
