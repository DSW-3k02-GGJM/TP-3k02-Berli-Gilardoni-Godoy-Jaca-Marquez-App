import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { MarcasTableComponent } from '../marcas-table/marcas-table.component';

@Component({
  selector: 'app-marcas',
  standalone: true,
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
  imports: [CommonModule, HttpClientModule, MarcasTableComponent],
  providers: [ApiService],
})
export class MarcasComponent implements OnInit {
  marcas: any[] = []; // Lista de marcas a mostrar en la vista

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router // Servicio para manejar la navegación
  ) {}

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.fillData(); // Llama al método para llenar los datos de marcas
  }

  onMarcaDeleted(marcaId: number): void {
    // Maneja la eliminación de una marca
    this.marcas = this.marcas.filter((marca) => marca.id !== marcaId);
    // Filtra la lista de marcas para eliminar la marca cuyo ID coincide con marcaId
  }

  fillData() {
    // Llama al servicio para obtener todos los datos de marcas
    this.apiService.getAll('marcas').subscribe((response) => {
      this.marcas = response.data; // Asigna los datos obtenidos a la lista de marcas
    });
  }

  navigateToNewMarca(): void {
    // Navega a la página para crear una nueva marca
    this.router.navigate(['/marcas/creacion']);
  }
}

