// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ConfirmDeletionDialogComponent } from '@shared/components/confirm-deletion-dialog/confirm-deletion-dialog.component';
import { GenericErrorDialogComponent } from '@shared/components/generic-error-dialog/generic-error-dialog.component';

// Pipes
import { FilterPipe } from '@shared/pipes/filter/filter.pipe';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  templateUrl: './categories-table.component.html',
  styleUrl: '../../../../shared/styles/genericTable.scss',
  imports: [
    CommonModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class CategoriesTableComponent {
  @Input() categories!: any[];
  @Input() errorMessage: string = '';
  @Output() categoryDeleted = new EventEmitter<number>();

  filterRows: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Eliminar categoría',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar la categoría ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService.delete('categories', Number(id)).subscribe({
            next: () => {
              this.categoryDeleted.emit(id);
              this.snackBarService.show(
                'La categoría ha sido eliminada exitosamente'
              );
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar la categoría');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar la categoría',
        message:
          'La categoría no se puede eliminar porque tiene modelos asociados.',
        haveRouterLink: false,
      },
    });
  }

  get filteredCategories() {
    return this.categories.filter((category) =>
      category.categoryName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  editCategory(category: any): void {
    this.router.navigate(['/staff/categories/' + category.id]);
  }

  deleteCategory(category: any): void {
    this.openDeleteDialog(category.categoryName, category.id);
  }
}
