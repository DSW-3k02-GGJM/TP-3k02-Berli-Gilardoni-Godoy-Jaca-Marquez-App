import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Módulo para hacer solicitudes HTTP
import { ApiService } from '../../service/api.service'; // Servicio para manejar la API
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { BrandFormComponent } from '../brand-form/brand-form.component.js';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'app-brands-table',
  standalone: true, // Permite que el componente se use sin necesidad de un módulo Angular tradicional
  templateUrl: './brands-table.component.html', // Ruta del archivo de plantilla HTML
  styleUrls: ['../../styles/genericSearchInput.scss', './brands-table.component.scss', ], // Ruta del archivo de estilos SCSS
  imports: [
    CommonModule,
    HttpClientModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ], // Importaciones necesarias para el componente
  providers: [ApiService], // Proporciona el servicio ApiService a este componente
})
export class BrandsTableComponent {
  @Input() brands!: any[]; // Entrada de datos: lista de marcas
  @Output() brandDeleted = new EventEmitter(); // Evento que emite el ID de la marca eliminada
  filterRows = '';

  readonly dialog = inject(MatDialog);

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al eliminar la marca',
        message: 'La marca no se puede eliminar porque tiene modelos asociados.',
        haveRouterLink: false,
      }
    });
  }

  openConfirmDialog(name: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
              title: 'Eliminar marca',
              titleColor: 'danger',
              image: 'assets/delete.png',
              message: `¿Está seguro de que desea eliminar la marca ${name}?`,
              buttonTitle: 'Eliminar',
              buttonColor: 'danger',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService
            .delete('brands', Number(id))
            .subscribe({
              next: (response) => {
                this.brandDeleted.emit(id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  this.openErrorDialog();
                }
              }
            });
      }
    });
  }
  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router
  ) {}

  // Métod0 para navegar a la página de edición de una marca
  editBrand(brand: any): void {
    this.router.navigate(['/staff/brands/' + brand.id]);
  }

  // Métod0 para eliminar una marca
  deleteBrand(brand: any): void {
    console.log(brand);
    this.openConfirmDialog(brand.brandName, brand.id);
  }
}
