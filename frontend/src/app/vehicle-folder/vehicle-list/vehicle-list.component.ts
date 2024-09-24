/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
  //imports: [FormsModule],  // <--- IMPORTA FormsModule
  imports: [FormsModule, CommonModule, HttpClientModule, VehicleCardComponent],
  providers: [ApiService],
})
export class VehicleListComponent implements OnInit {
  /*
  response: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fillData();
  }

  fillData() {
    this.apiService.getAll('vehicleModels').subscribe((response) => {
      this.response = response.data;
    });
  }
    // aca empieza el otro

  response: any[] = [];
  filteredResponse: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fillData();
  }

  fillData() {
    this.apiService.getAll('vehicleModels').subscribe((response) => {
      this.response = response.data;
      this.filteredResponse = [...this.response];
    });
  }

  onFilterApplied(filterData: { fechaDesde: string; fechaHasta: string }) {
    const { fechaDesde, fechaHasta } = filterData;
    this.apiService
      .getAvailableVehicles(fechaDesde, fechaHasta)
      .subscribe((filteredVehicles) => {
        this.filteredResponse = filteredVehicles.data;
      });
  }
}
*/
import {CommonModule, NgForOf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { ApiService } from '../../service/api.service';
import { VehicleFilterComponent } from '../vehicle-filter/vehicle-filter.component'; // Importa el componente de filtro

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  imports: [HttpClientModule, VehicleCardComponent, VehicleFilterComponent, NgForOf],  // Asegúrate de agregarlo aquí
  providers: [ApiService],
})
export class VehicleListComponent implements OnInit {
  response: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fillData();
  }

  fillData() {

    this.apiService.getAll('vehicleModels').subscribe((response) => {
      this.response = response.data;
    });

  }


  
  onFilterApplied(filterData: { fechaDesde: string; fechaHasta: string }) {
    
    const { fechaDesde, fechaHasta } = filterData;
    
    
    this.apiService.getAvailableVehicleModels(fechaDesde, fechaHasta).subscribe((filteredModels) => {
      this.response = filteredModels.data;  // Actualiza la lista de modelos de vehículos
    });


    
  }
  
}
