// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { VehicleModelsTableComponent } from '../vehicle-models-table/vehicle-models-table.component';

@Component({
  selector: 'app-vehicle-models',
  standalone: true,
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss',
  imports: [CommonModule, VehicleModelsTableComponent],
})
export class VehicleModelsComponent {
  vehicleModels: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onVehicleModelDeleted(vehicleModelId: number): void {
    this.vehicleModels = this.vehicleModels.filter(
      (vehicleModel) => vehicleModel.id !== vehicleModelId
    );
  }

  fillData() {
    this.apiService.getAll('vehicle-models').subscribe({
      next: (response) => (this.vehicleModels = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newVehicleModel() {
    this.router.navigate(['staff/vehicle-models/create']);
  }
}
