// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { CategoryApiService } from '@core/category/services/category.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Category } from '@core/category/interfaces/category.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { CategoryFilterPipe } from '@core/category/pipes/category-filter.pipe';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  templateUrl: './categories-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    CategoryFilterPipe,
    ActionButtonsComponent,
  ],
})
export class CategoriesTableComponent {
  @Input() categories: Category[] = [];
  @Output() categoryDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly categoryApiService: CategoryApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  private openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'categoría',
        message: `¿Está seguro de que desea eliminar la categoría ${name}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.categoryApiService.delete(id).subscribe({
            next: (response: Message) => this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: Message): void {
    this.categoryDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
  }

  get filteredCategories(): Category[] {
    return this.categories.filter((category: Category) =>
      category.categoryName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  private getCategoryName(category: ActionButtons): string {
    return 'categoryName' in category ? category.categoryName : '';
  }

  editCategory(category: ActionButtons): void {
    this.router.navigate([`/staff/categories/${category.id}`]);
  }

  deleteCategory(category: ActionButtons): void {
    this.openDeleteDialog(this.getCategoryName(category), category.id);
  }
}
