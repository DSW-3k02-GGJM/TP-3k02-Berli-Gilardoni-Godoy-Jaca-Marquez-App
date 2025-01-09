// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { BrandsTableComponent } from '../brands-table/brands-table.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
  imports: [CommonModule, BrandsTableComponent],
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onBrandDeleted(brandId: number): void {
    this.brands = this.brands.filter((brand) => brand.id !== brandId);
  }

  fillData() {
    this.apiService.getAll('brands').subscribe({
      next: (response) => (this.brands = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newBrand() {
    this.router.navigate(['/staff/brands/create']);
  }
}
