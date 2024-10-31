import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { VehicleModelFormComponent } from "../vehicleModel-form/vehicleModel-form.component.js";
import { Router } from '@angular/router';
import { GenericErrorModalComponent } from '../../shared/generic-error-modal/generic-error-modal.component.js';

@Component({
  selector: 'app-vehicleModels-table',
  standalone: true,
  templateUrl: './vehicleModels-table.component.html',
  styleUrl: './vehicleModels-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ],
  providers: [ApiService],
})
export class VehicleModelsTableComponent {
  @Input() vehicleModels!: any[];
  @Output() vehicleModelDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService, 
    private modalService: NgbModal,
    private router: Router
  ) {}

  editVehicleModel(vehicleModel: any): void {
    this.router.navigate(['/staff/vehicleModels/' + vehicleModel.id]);
  }

  deleteVehicleModel(vehicleModel: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar modelo?';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar el modelo ${vehicleModel.vehicleModelName}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('vehicleModels', Number(vehicleModel.id))
            .subscribe({
              next: (response) => {
                this.vehicleModelDeleted.emit(vehicleModel.id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  const modalRef = this.modalService.open(GenericErrorModalComponent);
                  modalRef.componentInstance.title = 'Error al eliminar el model';
                  modalRef.componentInstance.message = 'El modelo no se puede eliminar porque tiene vehiculos asociados.';
                }
              }
            });
        }
      },
      () => {}
    );
  }
}
