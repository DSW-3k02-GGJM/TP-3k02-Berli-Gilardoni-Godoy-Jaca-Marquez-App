import {CommonModule, NgForOf} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { ApiService } from '../../service/api.service';
import { VehicleFilterComponent } from '../vehicle-filter/vehicle-filter.component';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {filter} from "rxjs"; // Importa el componente de filtro

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    VehicleCardComponent,
    VehicleFilterComponent,
    NgForOf],
  providers: [ApiService, NgbActiveModal, NgbModal],
})
export class VehicleListComponent implements OnInit {
  @Input() availableVehicles: any[] = [];
  response: any[] = [];

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.openFilterModal(false);
  }

  openFilterModal(dismissable : boolean) {
    const modalRef = this.modalService.open(VehicleFilterComponent, {
      size: 'l',
      centered: true,
      beforeDismiss: () => dismissable //para que no se pueda cerrar
    });
    modalRef.componentInstance.filterApplied.subscribe((filter: { startDate: string; endDate: string; location: string }) => {
      this.onFilterApplied(filter);
    });
  }

  editFilter() {
    this.openFilterModal(true);
  }

  fetchVehicles() {
    this.http.get<any>('http://localhost:3000/api/vehicles/available').subscribe(response => {
      console.log('Response data:', response);
      this.response = response.data.map((vehicle: any) => ({
        vehicleModel: vehicle.vehicleModelName,
        categoryDescription: vehicle.categoryName,
        passengerCount: vehicle.passengerCount,
        image: vehicle.imagePath
      }));
    }, error => {
      console.error('Error fetching vehicles:', error);
    });
  }

  onFilterApplied(filter: { startDate: string; endDate: string; location: string }) {
    const { startDate, endDate, location } = filter;
    console.log('Filter applied:', filter);
    this.fetchVehicles();
    this.http.get<any[]>(`http://localhost:3000/api/vehicles?startDate=${filter.startDate}&endDate=${filter.endDate}`).subscribe(data => {
      this.response = data.map(vehicle => ({
        vehicleModel: vehicle.vehicle.vehicle_model_name,
        categoryDescription: vehicle.category_name,
        passengerCount: vehicle.passenger_count,
        image: vehicle.image_path
      }));
    });

    this.apiService.getAvailableVehicleModels(startDate, endDate, location).subscribe((filteredModels) => {
      this.response = filteredModels.data;  // Actualiza la lista de modelos de vehículos
    });
  }
}
