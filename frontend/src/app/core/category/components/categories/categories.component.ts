// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { CategoryApiService } from '@core/category/services/category.api.service';

// Components
import { CategoriesTableComponent } from '@core/category/components/categories-table/categories-table.component';

// Interfaces
import { Category } from '@core/category/interfaces/category.interface';
import { CategoriesResponse } from '@core/category/interfaces/categories-response.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, CategoriesTableComponent],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  errorMessage: string = '';

  constructor(
    private readonly categoryApiService: CategoryApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onCategoryDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.categoryApiService.getAll().subscribe({
      next: (response: CategoriesResponse) => (this.categories = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newCategory(): void {
    this.router.navigate(['/staff/categories/create']);
  }
}
