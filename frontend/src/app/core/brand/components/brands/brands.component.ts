// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { BrandApiService } from '@core/brand/services/brand.api.service';

// Components
import { BrandsTableComponent } from '@core/brand/components/brands-table/brands-table.component';

// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';
import { BrandsResponse } from '@core/brand/interfaces/brands-response.interface';

@Component({
  selector: 'app-brands',
  standalone: true,
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
  imports: [CommonModule, BrandsTableComponent],
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  errorMessage: string = '';

  constructor(
    private readonly brandApiService: BrandApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onBrandDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.brandApiService.getAll().subscribe({
      next: (response: BrandsResponse) => (this.brands = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newBrand(): void {
    this.router.navigate(['/staff/brands/create']);
  }
}
