// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';

// Components
import { VehiclesTableComponent } from '@core/vehicle/components/vehicles-table/vehicles-table.component';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import { VehiclesResponse } from '@core/vehicle/interfaces/vehicles-response.interface';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, VehiclesTableComponent],
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  errorMessage: string = '';

  constructor(
    private readonly vehicleApiService: VehicleApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onVehicleDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.vehicleApiService.getAll().subscribe({
      next: (response: VehiclesResponse) => (this.vehicles = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newVehicle(): void {
    this.router.navigate(['/staff/vehicles/create']);
  }
}
