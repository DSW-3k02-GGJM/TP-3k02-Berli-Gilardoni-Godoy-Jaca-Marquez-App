import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { BrandCreatedOrModifiedService } from '../brand-created-or-modified/brand.service.js';
import { Subscription } from 'rxjs';
import {BrandsTableComponent} from "../brands-table/brands-table.component.js";
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
  imports: [CommonModule, HttpClientModule, BrandsTableComponent],
  providers: [ApiService],
})
export class BrandsComponent implements OnInit, OnDestroy {
  brands: any[] = []; // Lista de brands a mostrar en la vista
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private brandCreatedOrModifiedService: BrandCreatedOrModifiedService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.fillData(); // Llama al métod0 para llenar los datos de brands
  }

  ngOnDestroy(): void {
    this.brandCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onBrandDeleted(brandId: number): void {
    // Maneja la eliminación de una marca
    this.brands = this.brands.filter((brand) => brand.id !== brandId);
    // Filtra la lista de brands para eliminar la marca cuyo ID coincide con marcaId
  }

  fillData() {
    this.subscription =
      this.brandCreatedOrModifiedService.brandCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.brandCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('brands').subscribe((response) => {
      this.brands = response.data;
    });
  }

  newBrand() {
    this.router.navigate(['/staff/brands/create']);
  }
}
