// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { VehiclesTableComponent } from '../vehicles-table/vehicles-table.component';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
  imports: [CommonModule, VehiclesTableComponent],
})
export class VehiclesComponent {
  vehicles: Vehicle[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onVehicleDeleted(vehicleId: number): void {
    this.vehicles = this.vehicles.filter(
      (vehicle) => Number(vehicle.id) !== vehicleId
    );
  }

  fillData() {
    this.apiService.getAll('vehicles').subscribe({
      next: (response) => (this.vehicles = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newVehicle() {
    this.router.navigate(['/staff/vehicles/create']);
  }
}
