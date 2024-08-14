import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';
import { CategoriasTableComponent } from '../categorias-table/categorias-table.component';
import { CategoriaCreatedOrModifiedService } from '../categoria-created-or-modified/cat.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
  imports: [CommonModule, HttpClientModule, CategoriasTableComponent],
  providers: [ApiService],
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private categoriaCreatedOrModifiedService: CategoriaCreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCategoriaDeleted(categoriaId: number): void {
    this.categorias = this.categorias.filter(
      (categoria) => categoria.id !== categoriaId
    );
  }

  fillData() {
    this.subscription =
      this.categoriaCreatedOrModifiedService.categoriaCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.categoriaCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('categorias').subscribe((response) => {
      this.categorias = response.data;
    });
  }

  newCategoria() {
    const modalRef = this.modalService.open(CategoriaFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nueva Categoría';
  }
}
