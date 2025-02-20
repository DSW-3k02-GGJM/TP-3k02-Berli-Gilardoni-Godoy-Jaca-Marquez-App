// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { BrandsTableComponent } from '@core/brand/components/brands-table/brands-table.component';

// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';
import { BrandsResponse } from '@core/brand/interfaces/brands-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-brands',
  standalone: true,
  templateUrl: './brands.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, BrandsTableComponent],
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];

  constructor(
    private readonly brandApiService: BrandApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onBrandDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.brandApiService.getAll().subscribe({
      next: (response: BrandsResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: BrandsResponse): void {
    this.brands = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newBrand(): void {
    this.router.navigate(['/staff/brands/create']);
  }
}
