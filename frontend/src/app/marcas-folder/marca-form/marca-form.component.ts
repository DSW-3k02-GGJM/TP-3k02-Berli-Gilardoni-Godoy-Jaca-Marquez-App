import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // VERRRRRRRR
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule], // VERRRR
  providers: [ApiService],
})
export class MarcaFormComponent implements OnInit {
  action: string = ''; // Acción actual (Create o Edit)
  currentMarca: any; // Datos de la marca actual (para edición)
  nombre = ''; // Valor del campo 'nombre'

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router, // Servicio para manejar la navegación
    private activatedRoute: ActivatedRoute // Servicio para acceder a los parámetros de la ruta
  ) {}

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        // Si hay un ID en los parámetros, es una edición
        this.apiService
          .getOne('marcas', Number(params.id)) // Obtiene los datos de la marca por ID
          .subscribe((response) => {
            this.currentMarca = response.data; // Guarda la marca actual
            this.setFormValues(); // Establece los valores del formulario con los datos de la marca
          });
        this.action = 'Edit'; // Establece la acción como 'Edit'
      } else {
        this.action = 'Create'; // Establece la acción como 'Create' si no hay ID
      }
    });
  }

  onSubmit() {
    const formData = {
      nombre: this.nombre, // Crea un objeto con los datos del formulario
    };
    if (this.action === 'Create') {
      // Si la acción es 'Create', llama al servicio para crear una nueva marca
      this.apiService.create('marcas', formData).subscribe((response) => {
      });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar la marca existente
      this.apiService
        .update('marcas', this.currentMarca.id, formData)
        .subscribe((response) => {
        });
    }
  }

  navigateToMarcas(): void {
    this.router.navigate(['/marcas']); // Navega a la lista de marcas
  }

  private async setFormValues(): Promise<void> {
    this.nombre = this.currentMarca.nombre; // Establece el valor del campo 'nombre' con los datos de la marca
  }
}

