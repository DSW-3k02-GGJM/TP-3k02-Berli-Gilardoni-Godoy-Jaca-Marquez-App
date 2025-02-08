// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { CategoryApiService } from '@core/category/services/category.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { CategoriesTableComponent } from '@core/category/components/categories-table/categories-table.component';

// Interfaces
import { Category } from '@core/category/interfaces/category.interface';
import { CategoriesResponse } from '@core/category/interfaces/categories-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, CategoriesTableComponent],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private readonly categoryApiService: CategoryApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onCategoryDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.categoryApiService.getAll().subscribe({
      next: (response: CategoriesResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: CategoriesResponse): void {
    this.categories = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newCategory(): void {
    this.router.navigate(['/staff/categories/create']);
  }
}
