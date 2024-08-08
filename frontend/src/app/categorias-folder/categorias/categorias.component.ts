import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriasTableComponent } from "../categorias-table/categorias-table.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CategoriasTableComponent, CommonModule, HttpClientModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
  providers: [ApiService],
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onCategoriaDeleted(categoriaId: number): void {
    this.categorias = this.categorias.filter((categoria) => categoria.id !== categoriaId);
  }

  fillData() {
    this.apiService.getAll('categorias').subscribe((response) => {
      this.categorias = response.data;
    });
  }

  navigateToNewCategoria(): void {
    this.router.navigate(['/categorias/creacion']);
  }
}
