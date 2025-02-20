// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { VehicleModelsTableComponent } from '@core/vehicle-model/components/vehicle-models-table/vehicle-models-table.component';

// Interfaces
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { VehicleModelsResponse } from '@core/vehicle-model/interfaces/vehicle-models-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';

@Component({
  selector: 'app-vehicle-models',
  standalone: true,
  templateUrl: './vehicle-models.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, VehicleModelsTableComponent],
})
export class VehicleModelsComponent implements OnInit {
  vehicleModels: VehicleModel[] = [];

  constructor(
    private readonly vehicleModelApiService: VehicleModelApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onVehicleModelDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.vehicleModelApiService.getAll().subscribe({
      next: (response: VehicleModelsResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: VehicleModelsResponse): void {
    this.vehicleModels = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newVehicleModel(): void {
    this.router.navigate(['staff/vehicle-models/create']);
  }
}
