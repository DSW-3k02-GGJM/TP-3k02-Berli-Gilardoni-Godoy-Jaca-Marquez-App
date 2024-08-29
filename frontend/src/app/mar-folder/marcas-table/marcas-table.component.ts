import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Módulo para hacer solicitudes HTTP
import { ApiService } from '../../service/api.service'; // Servicio para manejar la API
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component.js';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { MarcaFormComponent } from '../marca-form/marca-form.component';

@Component({
  selector: 'app-marcas-table',
  standalone: true, // Permite que el componente se use sin necesidad de un módulo Angular tradicional
  templateUrl: './marcas-table.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './marcas-table.component.scss', // Ruta del archivo de estilos SCSS
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ], // Importaciones necesarias para el componente
  providers: [ApiService], // Proporciona el servicio ApiService a este componente
})
export class MarcasTableComponent {
  @Input() marcas!: any[]; // Entrada de datos: lista de marcas
  @Output() marcaDeleted = new EventEmitter(); // Evento que emite el ID de la marca eliminada
  filterRows = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private modalService: NgbModal
  ) {}

  // Método para navegar a la página de edición de una marca
  editMarca(marca: any): void {
    const modalRef = this.modalService.open(MarcaFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Editar Marca';
    modalRef.componentInstance.currentMarcaId = marca.id;
  }

  // Método para eliminar una marca
  deleteMarca(marca: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar marca';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar la marca ${marca.nombre}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('marcas', Number(marca.id))
            .subscribe((response) => {
              this.marcaDeleted.emit(marca.id);
            });
        }
      },
      () => {}
    );
  }
}
