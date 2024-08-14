import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { ModeloFormComponent } from '../modelo-form/modelo-form.component.js';

@Component({
  selector: 'app-modelos-table',
  standalone: true,
  templateUrl: './modelos-table.component.html',
  styleUrl: './modelos-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ],
  providers: [ApiService],
})
export class ModelosTableComponent {
  @Input() modelos!: any[];
  @Output() modeloDeleted = new EventEmitter();
  filterRows = '';

  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  editModelo(modelo: any): void {
    const modalRef = this.modalService.open(ModeloFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Editar Modelo';
    modalRef.componentInstance.currentModeloId = modelo.id;
  }

  deleteModelo(modelo: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar modelo';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar el modelo ${modelo.nombre}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('modelos', Number(modelo.id))
            .subscribe((response) => {
              this.modeloDeleted.emit(modelo.id);
            });
        }
      },
      () => {}
    );
  }
}
