import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';
import { CategoriesTableComponent } from '../categories-table/categories-table.component';
import { CategoryCreatedOrModifiedService } from '../category-created-or-modified/cat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [CommonModule, HttpClientModule, CategoriesTableComponent],
  providers: [ApiService],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private categoryCreatedOrModifiedService: CategoryCreatedOrModifiedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    this.categoryCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCategoryDeleted(categoryId: number): void {
    this.categories = this.categories.filter(
      (category) => category.id !== categoryId
    );
  }

  fillData() {
    this.subscription =
      this.categoryCreatedOrModifiedService.categoryCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.categoryCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('categories').subscribe((response) => {
      this.categories = response.data;
    });
  }

  newCategory() {
    this.router.navigate(['/staff/categories/create']);
  }
}
