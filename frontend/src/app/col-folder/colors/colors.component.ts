import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ColorsTableComponent } from '../colors-table/colors-table.component';
import { ColorCreatedOrModifiedService } from '../color-created-or-modified/col.service';
import { Subscription } from 'rxjs';
import { ColorFormComponent } from '../color-form/color-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-colors',
  standalone: true,
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  imports: [CommonModule, HttpClientModule, ColorsTableComponent],
  providers: [ApiService],
})
export class ColorsComponent implements OnInit, OnDestroy {
  colors: any[] = []; // Lista de colores a mostrar en la vista
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private colorCreatedOrModifiedService: ColorCreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.fillData(); // Llama al método para llenar los datos de colores
  }

  ngOnDestroy(): void {
    this.colorCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onColorDeleted(colorId: number): void {
    // Maneja la eliminación de un color
    this.colors = this.colors.filter((color) => color.id !== colorId);
    // Filtra la lista de marcas para eliminar la marca cuyo ID coincide con marcaId
  }

  fillData() {
    this.subscription =
      this.colorCreatedOrModifiedService.colorCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.colorCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('colors').subscribe((response) => {
      this.colors = response.data;
    });
  }

  newColor() {
    const modalRef = this.modalService.open(ColorFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nuevo Color';
  }
}
