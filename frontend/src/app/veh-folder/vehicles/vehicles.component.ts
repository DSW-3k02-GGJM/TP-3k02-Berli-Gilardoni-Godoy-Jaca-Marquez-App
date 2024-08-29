import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { VehiclesTableComponent } from '../vehicles-table/vehicles-table.component';
import { VehicleCreatedOrModifiedService } from '../vehicle-created-or-modified/vehicle.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
  imports: [CommonModule, HttpClientModule, VehiclesTableComponent],
  providers: [ApiService],
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private vehicleCreatedOrModifiedService: VehicleCreatedOrModifiedService,
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
    this.apiService.getAll('vehiculos').subscribe((response) => {
      this.vehicles = response.data;
    });
  }

  newVehicle() {
    const modalRef = this.modalService.open(VehicleFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nuevo Vehiculo';
  }
}
