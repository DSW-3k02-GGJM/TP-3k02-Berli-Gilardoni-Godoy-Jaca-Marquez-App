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
  imports: [CommonModule/*, ResFormComponent*/],
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
    /*
    console.log("se ejecuta la funcioonnnnnnnnnnn");
    const modalRef = this.modalService.open(ResFormComponent, {
      //size: 'lg', // tamaño del modal
      //backdrop: 'static', // evita cerrar el modal haciendo clic fuera
      size: 'lg',
      centered: true,
    });
    console.log("se ejecuta la funcioonnnnnnnnnnn");
    modalRef.componentInstance.title = 'Reservar Vehículo'; // Título del modal
    modalRef.componentInstance.currentResId = -1; // Enviar el ID o datos necesarios al modal


    modalRef.result.then((result) => {
      console.log('Resultado del modal:', result);
    }).catch((error) => {
      console.error('Error al cerrar el modal:', error);
    });*/

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
      client: 1, // ID del cliente de prueba
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
