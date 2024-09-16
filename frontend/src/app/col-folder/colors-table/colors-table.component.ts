import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Módulo para hacer solicitudes HTTP
import { ApiService } from '../../service/api.service'; // Servicio para manejar la API
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component.js';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { ColorFormComponent } from '../color-form/color-form.component';

@Component({
  selector: 'app-colors-table',
  standalone: true, // Permite que el componente se use sin necesidad de un módulo Angular tradicional
  templateUrl: './colors-table.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './colors-table.component.scss', // Ruta del archivo de estilos SCSS
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ], // Importaciones necesarias para el componente
  providers: [ApiService], // Proporciona el servicio ApiService a este componente
})
export class ColorsTableComponent {
  @Input() colors!: any[]; // Entrada de datos: lista de colores
  @Output() colorDeleted = new EventEmitter(); // Evento que emite el ID de la marca eliminada
  filterRows = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private modalService: NgbModal
  ) {}

  // Métod0 para navegar a la página de edición de un color
  editColor(color: any): void {
    const modalRef = this.modalService.open(ColorFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Editar Color';
    modalRef.componentInstance.currentColorId = color.id;
  }

  // Métod0 para eliminar un color
  deleteColor(color: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar color';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar el color ${color.colorName}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('colors', Number(color.id))
            .subscribe((response) => {
              this.colorDeleted.emit(color.id);
            });
        }
      },
      () => {}
    );
  }
}
