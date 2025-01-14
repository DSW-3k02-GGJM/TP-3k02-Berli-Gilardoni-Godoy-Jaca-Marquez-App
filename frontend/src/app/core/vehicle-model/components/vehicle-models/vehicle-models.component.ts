// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';

// Components
import { VehicleModelsTableComponent } from '@core/vehicle-model/components/vehicle-models-table/vehicle-models-table.component';

// Interfaces
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { VehicleModelsResponse } from '@core/vehicle-model/interfaces/vehicle-models-response.interface';

@Component({
  selector: 'app-vehicle-models',
  standalone: true,
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss',
  imports: [CommonModule, VehicleModelsTableComponent],
})
export class VehicleModelsComponent implements OnInit {
  vehicleModels: VehicleModel[] = [];
  errorMessage: string = '';

  constructor(
    private readonly vehicleModelApiService: VehicleModelApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onVehicleModelDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.vehicleModelApiService.getAll().subscribe({
      next: (response: VehicleModelsResponse) =>
        (this.vehicleModels = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newVehicleModel(): void {
    this.router.navigate(['staff/vehicle-models/create']);
  }
}
