import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { VehicleModelsTableComponent } from '../vehicleModels-table/vehicleModels-table.component.js';
import { VehicleModelCreatedOrModifiedService } from '../vehicleModel-created-or-modified/vehicleModel.service.js';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleModelFormComponent } from '../vehicleModel-form/vehicleModel-form.component.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicleModels',
  standalone: true,
  templateUrl: './vehicleModels.component.html',
  styleUrl: './vehicleModels.component.scss',
  imports: [CommonModule, HttpClientModule, VehicleModelsTableComponent],
  providers: [ApiService],
})
export class VehicleModelsComponent implements OnInit, OnDestroy {
  vehicleModels: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private vehicleModelCreatedOrModifiedService: VehicleModelCreatedOrModifiedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    this.vehicleModelCreatedOrModifiedService.resetDataLoaded();
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
    this.router.navigate(['staff/vehicleModels/create']);
  }
}
