import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Router } from '@angular/router';
import { GenericErrorModalComponent } from '../../shared/generic-error-modal/generic-error-modal.component.js';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  templateUrl: './categories-table.component.html',
  styleUrl: './categories-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ],
  providers: [ApiService],
})
export class CategoriesTableComponent {
  @Input() categories!: any[];
  @Output() categoryDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService, 
    private modalService: NgbModal,
    private router: Router
  ) {}

  editCategory(category: any): void {
    this.router.navigate(['/staff/categories/' + category.id]);
  }

  deleteCategory(category: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar categoria';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar la categoria ${category.categoryName}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('categories', Number(category.id))
            .subscribe({
              next: (response) => {
                this.categoryDeleted.emit(category.id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  const modalRef = this.modalService.open(GenericErrorModalComponent);
                  modalRef.componentInstance.title = 'Error al eliminar la categoría';
                  modalRef.componentInstance.message = 'La categoría no se puede eliminar porque tiene modelos asociados.';
                }
              }
            });
        }
      },
      () => {}
    );
  }
}
