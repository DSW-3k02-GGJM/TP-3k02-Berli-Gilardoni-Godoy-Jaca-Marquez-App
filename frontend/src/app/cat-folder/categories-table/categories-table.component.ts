import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component.js';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  templateUrl: './categories-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', '../../styles/genericTable.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  providers: [ApiService],
})
export class CategoriesTableComponent {
  readonly dialog = inject(MatDialog);

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al eliminar la categoría',
        message: 'La categoría no se puede eliminar porque tiene modelos asociados.',
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
              title: 'Eliminar categoría',
              titleColor: 'danger',
              image: 'assets/delete.png',
              message: `¿Está seguro de que desea eliminar la categoría ${name}?`,
              buttonTitle: 'Eliminar',
              buttonColor: 'danger',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService
            .delete('categories', Number(id))
            .subscribe({
              next: (response) => {
                this.categoryDeleted.emit(id);
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
    this.openConfirmDialog(category.categoryName, category.id);
  }
}
