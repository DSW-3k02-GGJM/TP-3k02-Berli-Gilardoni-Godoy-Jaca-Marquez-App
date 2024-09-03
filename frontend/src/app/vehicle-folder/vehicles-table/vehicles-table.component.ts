import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  templateUrl: './vehicles-table.component.html',
  styleUrl: './vehicles-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ],
  providers: [ApiService],
})
export class VehiclesTableComponent {
  @Input() vehicles!: any[];
  @Output() vehicleDeleted = new EventEmitter();
  //filterRows = '';

  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  editVehicle(vehicle: any): void {
    const modalRef = this.modalService.open(VehicleFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Editar Vehiculo';
    modalRef.componentInstance.currentVehicleId = vehicle.id;
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
            .subscribe((response) => {
              this.vehicleDeleted.emit(vehicle.id);
            });
        }
      },
      () => {}
    );
  }
}
