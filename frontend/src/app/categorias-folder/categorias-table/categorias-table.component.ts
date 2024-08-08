import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component.js';

@Component({
  selector: 'app-categorias-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ConfirmDeletionComponent],
  templateUrl: './categorias-table.component.html',
  styleUrl: './categorias-table.component.scss',
  providers: [ApiService],
})

export class CategoriasTableComponent {
  @Input() categorias!: any[];
  @Output() categoriaDeleted = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  editCategoria(categoria: any): void {
    this.router.navigate(['/categorias/modificacion', categoria.id]);
  }

  deleteCategoria(categoria: any): void {
    console.log(categoria);
    const dialogRef = this.dialog.open(ConfirmDeletionComponent, {
      data: {
        title: 'Eliminar categoria',
        message: `¿Estás seguro de eliminar a la categoría ${
          categoria.nombre
        }?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .delete('categorias', Number(categoria.id))
          .subscribe((response) => {
            console.log(response);
            this.categoriaDeleted.emit(categoria.id);
          });
      }
    });
  }
}
