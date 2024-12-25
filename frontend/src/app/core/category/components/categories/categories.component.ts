// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { CategoriesTableComponent } from '../categories-table/categories-table.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [CommonModule, CategoriesTableComponent],
  providers: [ApiService],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onCategoryDeleted(categoryId: number): void {
    this.categories = this.categories.filter(
      (category) => category.id !== categoryId
    );
  }

  fillData() {
    this.apiService.getAll('categories').subscribe({
      next: (response) => (this.categories = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newCategory() {
    this.router.navigate(['/staff/categories/create']);
  }
}
