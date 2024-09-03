import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { VehicleModelsTableComponent } from '../vehicleModels-table/vehicle-models-table.component.js';
import { VehicleModelCreatedOrModifiedService } from '../vehicleModel-created-or-modified/vehicleModel.service.js';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleModelFormComponent } from '../vehicleModel-form/vehicle-model-form.component.js';

@Component({
  selector: 'app-vehicleModels',
  standalone: true,
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss',
  imports: [CommonModule, HttpClientModule, VehicleModelsTableComponent],
  providers: [ApiService],
})
export class VehicleModelsComponent implements OnInit {
  vehicleModels: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private vehicleModelCreatedOrModifiedService: VehicleModelCreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onVehicleModelDeleted(vehicleModelId: number): void {
    this.vehicleModels = this.vehicleModels.filter((vehicleModel) => vehicleModel.id !== vehicleModelId);
  }

  fillData() {
    this.subscription =
      this.vehicleModelCreatedOrModifiedService.vehicleModelCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.vehicleModelCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('vehicleModels').subscribe((response) => {
      this.vehicleModels = response.data;
    });
  }

  newVehicleModel() {
    const modalRef = this.modalService.open(VehicleModelFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nuevo Modelo';
  }
}
