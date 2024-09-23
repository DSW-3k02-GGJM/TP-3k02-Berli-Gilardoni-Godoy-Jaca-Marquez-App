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
    private resCreatedOrModifiedService: ResCreatedOrModifiedService
  ) {}

  formatDate(DateDB: string): string {
    let DateTable: string = '${day}/${month}/${year}';
    DateTable = DateTable.replace('${month}', DateDB.substring(5, 7));
    DateTable = DateTable.replace('${day}', DateDB.substring(8, 10));
    DateTable = DateTable.replace('${year}', DateDB.substring(0, 4));
    return DateTable;
  }

  editRes(res: any): void {
    const modalRef = this.modalService.open(ResFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Editar Reserva';
    modalRef.componentInstance.currentResId = res.id;
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
          this.apiService
            .update('reservations', Number(res.id), {
              initialKms: res.vehicle.totalKms,
            })
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
          this.apiService
            .update('reservations', Number(res.id), {
              realEndDate: new Date().toISOString().split('T')[0],
              finalKm: res.vehicle.totalKms,
            })
            .subscribe((response) => {
              this.resCreatedOrModifiedService.notifyResCreatedOrModified();
            });
        }
      },
      () => {}
    );
  }
}
