import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { VehiclesTableComponent } from '../vehicles-table/vehicles-table.component';
import { VehicleCreatedOrModifiedService } from '../vehicle-created-or-modified/vehicle.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
  imports: [CommonModule, HttpClientModule, VehiclesTableComponent],
  providers: [ApiService],
})
export class VehiclesComponent implements OnInit, OnDestroy {
  vehicles: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private vehicleCreatedOrModifiedService: VehicleCreatedOrModifiedService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    this.vehicleCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onVehicleDeleted(vehicleId: number): void {
    this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== vehicleId);
  }

  fillData() {
    this.subscription =
      this.vehicleCreatedOrModifiedService.vehicleCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.vehicleCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('vehicles').subscribe((response) => {
      this.vehicles = response.data;
    });
  }

  newVehicle() {
    this.router.navigate(['/staff/vehiclesS/create']);
  }
}
