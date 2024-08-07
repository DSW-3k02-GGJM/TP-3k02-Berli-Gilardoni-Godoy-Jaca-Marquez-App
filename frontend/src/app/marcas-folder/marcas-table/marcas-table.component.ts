import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Módulo para hacer solicitudes HTTP
import { ApiService } from '../../service/api.service'; // Servicio para manejar la API
import { MatDialog } from '@angular/material/dialog'; // Servicio para manejar diálogos
import { MarcaConfirmDeletionComponent } from '../marca-confirm-deletion/marca-confirm-deletion.component'; // Componente para confirmación de eliminación

@Component({
  selector: 'app-marcas-table',
  standalone: true, // Permite que el componente se use sin necesidad de un módulo Angular tradicional
  templateUrl: './marcas-table.component.html', // Ruta del archivo de plantilla HTML
  styleUrls: ['./marcas-table.component.scss'], // Ruta del archivo de estilos SCSS
  imports: [CommonModule, HttpClientModule], // Importaciones necesarias para el componente
  providers: [ApiService], // Proporciona el servicio ApiService a este componente
})
export class MarcasTableComponent {
  @Input() marcas!: any[]; // Entrada de datos: lista de marcas
  @Output() marcaDeleted = new EventEmitter<number>(); // Evento que emite el ID de la marca eliminada

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router, // Servicio para manejar la navegación
    private dialog: MatDialog // Servicio para mostrar diálogos
  ) {}

  // Método para navegar a la página de edición de una marca
  editMarca(marca: any): void {
    this.router.navigate(['/marcas/modificacion', marca.id]);
  }

  // Método para eliminar una marca
  deleteMarca(marca: any): void {
    console.log(marca);
    // Abre un diálogo para confirmar la eliminación
    const dialogRef = this.dialog.open(MarcaConfirmDeletionComponent, {
      data: {
        title: 'Eliminar marca',
        message: `¿Estás seguro de eliminar esta marca ${
          marca.apellido + ', ' + marca.nombre
        }?`,
      },
    });

    // Después de cerrar el diálogo, verifica si el usuario confirmó la eliminación
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Llama al servicio para eliminar la marca
        this.apiService.delete('marcas', Number(marca.id)).subscribe((response) => {
          console.log(response);
          // Emite el evento de marca eliminada con el ID de la marca
          this.marcaDeleted.emit(marca.id);
        });
      }
    });
  }
}

