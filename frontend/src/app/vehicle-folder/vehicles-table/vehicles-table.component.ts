import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { Router } from '@angular/router';
import { GenericErrorModalComponent } from '../../shared/generic-error-modal/generic-error-modal.component.js';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  templateUrl: './vehicles-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', './vehicles-table.component.scss'],
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
export class VehiclesTableComponent {
  @Input() vehicles!: any[];
  @Output() vehicleDeleted = new EventEmitter()
  filterRows = '';

  constructor(
    private apiService: ApiService, 
    private modalService: NgbModal,
    private router: Router
  ) {}

  editVehicle(vehicle: any): void {
    this.router.navigate(['/staff/vehiclesS/' + vehicle.id]);
  }

  deleteVehicle(vehicle: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar Vehiculo';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar el Vehiculo ${vehicle.licensePlate}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('vehicles', Number(vehicle.id))
            .subscribe({
              next: (response) => {
                this.vehicleDeleted.emit(vehicle.id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  const modalRef = this.modalService.open(GenericErrorModalComponent);
                  modalRef.componentInstance.title = 'Error al eliminar el vehículo';
                  modalRef.componentInstance.message = 'El vehículo no se puede eliminar porque tiene reservas asociadas.';
                }
              }
            });
        }
      },
      () => {}
    );
  }
}
