// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { CategoryApiService } from '@core/category/services/category.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Category } from '@core/category/interfaces/category.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Pipes
import { CategoryFilterPipe } from '@core/category/pipes/category-filter.pipe';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  templateUrl: './categories-table.component.html',
  styleUrl: '../../../../shared/styles/genericTable.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    CategoryFilterPipe,
  ],
})
export class CategoriesTableComponent {
  @Input() categories: Category[] = [];
  @Input() errorMessage: string = '';
  @Output() categoryDeleted = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly categoryApiService: CategoryApiService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.dialog.open(GenericDialogComponent, {
        width: '350px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: {
          title: 'Eliminar categoría',
          titleColor: 'danger',
          image: 'assets/delete.png',
          message: `¿Está seguro de que desea eliminar la categoría ${name}?`,
          showBackButton: true,
          backButtonTitle: 'Volver',
          mainButtonTitle: 'Eliminar',
          mainButtonColor: 'bg-danger',
          haveRouterLink: false,
        },
      } as GenericDialog);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.categoryApiService.delete(id).subscribe({
            next: () => {
              this.categoryDeleted.emit();
              this.snackBarService.show(
                'La categoría ha sido eliminada exitosamente'
              );
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog(error.error.message);
              } else {
                this.snackBarService.show('Error al eliminar la categoría');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar la categoría',
        titleColor: 'dark',
        image: 'assets/wrongmark.png',
        message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredCategories(): Category[] {
    return this.categories.filter((category: Category) =>
      category.categoryName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  editCategory(category: Category): void {
    this.router.navigate([`/staff/categories/${category.id}`]);
  }

  deleteCategory(category: Category): void {
    this.openDeleteDialog(category.categoryName, category.id);
  }
}
