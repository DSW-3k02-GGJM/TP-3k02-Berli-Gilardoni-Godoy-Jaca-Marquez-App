import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component.js';

@Component({
  selector: 'app-categorias-table',
  standalone: true,
  templateUrl: './categorias-table.component.html',
  styleUrl: './categorias-table.component.scss',
  imports: [CommonModule, HttpClientModule, ConfirmDeletionComponent],
  providers: [ApiService],
})
export class CategoriasTableComponent {
  @Input() categorias!: any[];
  @Output() categoriaDeleted = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  editCategoria(categoria: any): void {
    this.router.navigate(['/categorias/modificacion', categoria.id]);
  }

  deleteCategoria(categoria: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar categoria';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar la categoria ${categoria.nombre}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('categorias', Number(categoria.id))
            .subscribe((response) => {
              this.categoriaDeleted.emit(categoria.id);
            });
        }
      },
      () => {}
    );
  }
}
