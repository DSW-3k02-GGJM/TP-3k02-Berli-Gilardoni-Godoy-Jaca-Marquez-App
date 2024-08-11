import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ColorsTableComponent } from '../colors-table/colors-table.component';
import { ColorCreatedOrModifiedService } from '../color-created-or-modified/color-created-or-modified.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-colors',
  standalone: true,
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  imports: [CommonModule, HttpClientModule, ColorsTableComponent],
  providers: [ApiService],
})
export class ColorsComponent implements OnInit {
  colors: any[] = []; // Lista de colores a mostrar en la vista
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router, // Servicio para manejar la navegación
    private colorCreatedOrModifiedService: ColorCreatedOrModifiedService
  ) {}

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.fillData(); // Llama al método para llenar los datos de colores
  }

  ngOnDestroy(): void {
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
    this.apiService.getAll('colores').subscribe((response) => {
      this.colors = response.data;
    });
  }

  navigateToNewColor(): void {
    // Navega a la página para crear un nuevo color
    this.router.navigate(['/colores/creacion']);
  }
}