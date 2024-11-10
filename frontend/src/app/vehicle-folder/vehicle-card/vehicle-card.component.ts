/*
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { ResFormComponent } from '../../rescli-folder/rescli-form/rescli-form.component.js';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  standalone: true,
  styleUrls: ['./vehicle-card.component.scss'],
  imports: [CommonModule]
  //imports: [CommonModule, ResFormComponent],
})
export class VehicleCardComponent {
  @Input() vehicleModel!: string;
  @Input() categoryDescription!: string;
  @Input() image!: string;
  @Input() passengerCount!: Int16Array;
  @Input() pricePerDay!: number;
  @Input() deposit!: number;

  //constructor(private modalService: NgbModal) {}

  constructor(private modalService: NgbModal, private apiService: ApiService) {} // Inyecta el servicio ApiService
  // Método que se ejecuta al hacer clic en el botón "Alquilar"
  placeReservation() {
    

    console.log("se ejecuta la funcioonnnnnnnnnnn");

    // Valores por defecto para la reserva
    const reservationData = {
      reservationDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      plannedEndDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // 7 días después de la fecha de inicio
      realEndDate: null,
      cancellationDate: null,
      initialKms: 0,
      finalKm: null,
      user: 1, // ID del cliente de prueba
      vehicle: 1, // ID del vehículo de prueba
    };

    // Llamada al servicio ApiService para crear la reserva
    this.apiService.create('reservations', reservationData).subscribe(
      (response) => {
        console.log('Reserva creada:', response);
      },
      (error) => {
        console.error('Error al crear la reserva:', error);
      }
    );


  }


}
*/

// ---------------

import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../service/shared.service.ts.service'; // verr
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VehicleCardComponent implements OnInit {
  @Input() vehicleModel!: any;
  @Input() categoryDescription!: string;
  @Input() image!: string;
  @Input() passengerCount!: Int16Array;
  @Input() pricePerDay!: number;
  @Input() deposit!: number;

  @Output() modelSelected = new EventEmitter<any>();
  startDate: string = '';
  endDate: string = '';

  constructor(private apiService: ApiService, private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.startDate$.subscribe(date => this.startDate = date);
    this.sharedService.endDate$.subscribe(date => this.endDate = date);
  }

  placeReservation() {
    const vehicleData = {
      vehicleModel: this.vehicleModel,
      categoryDescription: this.categoryDescription,
      passengerCount: this.passengerCount,
      pricePerDay: this.pricePerDay,
      deposit: this.deposit
    };
    this.modelSelected.emit(vehicleData);
    /*
    console.log("se ejecuta la funcioonnnnnnnnnnn");

    const reservationData = {
      reservationDate: new Date().toISOString().split('T')[0],
      startDate: this.startDate, // Usar la fecha de inicio del filtro
      plannedEndDate: this.endDate, // Usar la fecha de fin del filtro
      realEndDate: null,
      cancellationDate: null,
      initialKms: 0,
      finalKm: null,
      user: 1, // ID del cliente de prueba
      vehicle: 1, // ID del vehículo de prueba
    };

    this.apiService.create('reservations', reservationData).subscribe(
      (response) => {
        console.log('Reserva creada:', response);
      },
      (error) => {
        console.error('Error al crear la reserva:', error);
      }
    );*/
  }
}