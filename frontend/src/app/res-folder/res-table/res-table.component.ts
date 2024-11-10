import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { ResFormComponent } from '../res-form/res-form.component.js';
import { ResCreatedOrModifiedService } from '../res-created-or-modified/res.service.js';
import { Router } from '@angular/router';
import { differenceInDays } from 'date-fns';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-res-table',
  standalone: true,
  templateUrl: './res-table.component.html',
  styleUrl: './res-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  providers: [ApiService],
})
export class ResTableComponent {
  @Input() reservations!: any[];
  @Output() resDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private router: Router
  ) {}

  formatDate(DateDB: string): string {
    let DateTable: string = '${day}/${month}/${year}';
    DateTable = DateTable.replace('${month}', DateDB.substring(5, 7));
    DateTable = DateTable.replace('${day}', DateDB.substring(8, 10));
    DateTable = DateTable.replace('${year}', DateDB.substring(0, 4));
    return DateTable;
  }

  editRes(res: any): void {
    this.router.navigate(['/staff/reservations/' + res.id]);
  }

  deleteRes(res: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar reserva?';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar la reserva?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('reservations', Number(res.id))
            .subscribe((response) => {
              this.resDeleted.emit(res.id);
            });
        }
      },
      () => {}
    );
  }

  checkInRes(res: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Check-in Reserva';
    modalRef.componentInstance.message = `¿Está seguro de que desea realizar el check-in de la reserva?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          const data = {
            // Se envían los cuatro primeros atributos porque son requeridos en el sanitizedInput del backend
            startDate: res.startDate,
            plannedEndDate: res.plannedEndDate,
            user: res.user.id,
            vehicle: res.vehicle.id,
            //
            initialKms: res.vehicle.totalKms,
          };

          this.apiService
            .update('reservations', Number(res.id), data)
            .subscribe((response) => {
              this.resCreatedOrModifiedService.notifyResCreatedOrModified();
            });
        }
      },
      () => {}
    );
  }

  checkOutRes(res: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Check-out Reserva';
    modalRef.componentInstance.message = `¿Está seguro de que desea realizar el check-out de la reserva?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          const data = {
            // Se envían los cuatro primeros atributos porque son requeridos en el sanitizedInput del backend
            startDate: res.startDate,
            plannedEndDate: res.plannedEndDate,
            user: res.user.id,
            vehicle: res.vehicle.id,
            //
            realEndDate: new Date().toISOString().split('T')[0],
            finalKm: res.vehicle.totalKms,
          };

          this.apiService
            .update('reservations', Number(res.id), data)
            .subscribe((response) => {
              this.resCreatedOrModifiedService.notifyResCreatedOrModified();
            });
        }
      },
      () => {}
    );
  }

  calculatePrice(res: any): string {
    const startDate = new Date(res.startDate);
    const plannedEndDate = new Date(res.plannedEndDate);
    const realEndDate = new Date(res.realEndDate);
    const pricePerDay = res.vehicle.vehicleModel.category.pricePerDay;

    // Determinar cuál de las dos fechas es mayor
    // Si el cliente devuelve el auto antes se le cobra según la fecha de fin planeada de la reserva
    // Si lo devuelve después de la fecha planeada, se le cobra según la fecha fin real (fecha al momento de la devolucion)
    const endDate = plannedEndDate > realEndDate ? plannedEndDate : realEndDate;

    // Calcular la diferencia en días y el precio
    const days = differenceInDays(endDate, startDate);
    return `${days * pricePerDay}`;
  }
}
