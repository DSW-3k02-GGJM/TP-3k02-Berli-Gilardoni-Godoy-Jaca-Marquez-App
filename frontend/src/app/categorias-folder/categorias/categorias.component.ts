import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service.js';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component.js';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
  providers: [ApiService],
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log('CategoriasComponent initialized');
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
    console.log('fillData');
    this.subscription =
      this.createdOrModifiedService.createdOrModified.subscribe(
        () => {
          console.log('createdOrModified');
          this.loadData();
        }
      );
    console.log(!this.createdOrModifiedService.isDataLoaded);
    if (!this.createdOrModifiedService.isDataLoaded) {
      console.log('!isDataLoaded');
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('categorias').subscribe((response) => {
      this.categorias = response.data;
    });
  }

  newCategoria() {
    const modalRef = this.modalService.open(CategoriaFormComponent, { size: 'l' , centered: true});
    modalRef.componentInstance.title = 'Nueva Categoría'
  }
}
