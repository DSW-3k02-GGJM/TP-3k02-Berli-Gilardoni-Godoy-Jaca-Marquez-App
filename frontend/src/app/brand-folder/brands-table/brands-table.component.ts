import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Módulo para hacer solicitudes HTTP
import { ApiService } from '../../service/api.service'; // Servicio para manejar la API
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component.js';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { BrandFormComponent } from '../brand-form/brand-form.component.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands-table',
  standalone: true, // Permite que el componente se use sin necesidad de un módulo Angular tradicional
  templateUrl: './brands-table.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './brands-table.component.scss', // Ruta del archivo de estilos SCSS
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ], // Importaciones necesarias para el componente
  providers: [ApiService], // Proporciona el servicio ApiService a este componente
})
export class BrandsTableComponent {
  @Input() brands!: any[]; // Entrada de datos: lista de marcas
  @Output() brandDeleted = new EventEmitter(); // Evento que emite el ID de la marca eliminada
  filterRows = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private modalService: NgbModal,
    private router: Router
  ) {}

  // Métod0 para navegar a la página de edición de una marca
  editBrand(brand: any): void {
    this.router.navigate(['/brands/' + brand.id]);
  }

  // Métod0 para eliminar una marca
  deleteBrand(brand: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar marca';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar la marca ${brand.brandName}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('brands', Number(brand.id))
            .subscribe((response) => {
              this.brandDeleted.emit(brand.id);
            });
        }
      },
      () => {}
    );
  }
}
