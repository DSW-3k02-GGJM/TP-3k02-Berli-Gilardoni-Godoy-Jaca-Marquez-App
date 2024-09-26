import {CommonModule, NgForOf} from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { ApiService } from '../../service/api.service';
import { VehicleFilterComponent } from '../vehicle-filter/vehicle-filter.component'; // Importa el componente de filtro


@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  imports: [HttpClientModule, VehicleCardComponent, VehicleFilterComponent, NgForOf],
  providers: [ApiService],
})
export class VehicleListComponent{
  response: any[] = [];

  constructor(private apiService: ApiService, private http: HttpClient) {}

  fetchVehicles() {
    this.http.get<any>('http://localhost:3000/api/vehicles').subscribe(response => {
      console.log('Response data:', response);
      if (Array.isArray(response.data)) {
        this.response = response.data.map((vehicle: any) => ({
          vehicleModel: vehicle.vehicleModelName,
          categoryDescription: vehicle.categoryName,
          passengerCount: vehicle.passengerCount,
          image: vehicle.imagePath
        }));
      } else {
        console.error('Expected an array but got:', response.data);
      }
    }, error => {
      console.error('Error fetching vehicles:', error);
    });
  }

  fillData() {

    this.apiService.getAll('vehicleModels').subscribe((response) => {
      this.response = response.data;
    });

  }

  onFilterApplied(filter: { startDate: string; endDate: string }) {
    this.fetchVehicles();
    this.http.get<any[]>(`http://localhost:3000/api/vehicles?startDate=${filter.startDate}&endDate=${filter.endDate}`).subscribe(data => {
      this.response = data.map(vehicle => ({
        vehicleModel: vehicle.vehicle.vehicle_model_name,
        categoryDescription: vehicle.category_name,
        passengerCount: vehicle.passenger_count,
        image: vehicle.image_path
      }));
    });

    const { startDate, endDate } = filter;

    this.apiService.getAvailableVehicleModels(startDate, endDate).subscribe((filteredModels) => {
      this.response = filteredModels.data;  // Actualiza la lista de modelos de vehículos
    });
  }
}
