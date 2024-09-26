import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResFormComponent } from '../../rescli-folder/rescli-form/rescli-form.component.js';
import { ResCreatedOrModifiedService } from '../../rescli-folder/rescli-created-or-modified/rescli.service.js';


import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  standalone: true,
  styleUrls: ['./vehicle-card.component.scss'],
  imports: [CommonModule, ResFormComponent],
})
export class VehicleCardComponent {
  @Input() vehicleModel!: string;
  @Input() categoryDescription!: string;
  @Input() image!: string;
  @Input() passengerCount!: Int16Array;

  constructor(private modalService: NgbModal) {}

  // Método que se ejecuta al hacer clic en el botón "Alquilar"
  placeReservation() {
    const modalRef = this.modalService.open(ResFormComponent, {
      //size: 'lg', // tamaño del modal
      //backdrop: 'static', // evita cerrar el modal haciendo clic fuera
      size: 'l',
      centered: true,
    });
    
    modalRef.componentInstance.title = 'Reservar Vehículo'; // Título del modal
    modalRef.componentInstance.currentResId = -1; // Enviar el ID o datos necesarios al modal

    /*
    modalRef.result.then((result) => {
      console.log('Resultado del modal:', result);
    }).catch((error) => {
      console.error('Error al cerrar el modal:', error);
    });*/
  }


}
