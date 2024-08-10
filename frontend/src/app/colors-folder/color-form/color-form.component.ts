import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ColorCreatedOrModifiedService } from '../color-created-or-modified/color-created-or-modified.service';

@Component({
  selector: 'app-color-form',
  standalone: true,
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class ColorFormComponent implements OnInit {
  action: string = ''; // Acción actual (Create o Edit)
  currentColorId: any; // Id de la color actual (para edición)

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router, // Servicio para manejar la navegación
    private activatedRoute: ActivatedRoute, // Servicio para acceder a los parámetros de la ruta
    private colorCreatedOrModifiedService: ColorCreatedOrModifiedService
  ) {}

  colorForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.colorCreatedOrModifiedService.isDataLoaded = false;

    // Se ejecuta al inicializar el componente
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        // Si hay un ID en los parámetros, es una edición
        this.apiService
          .getOne('colores', Number(params.id)) // Obtiene los datos del color por ID
          .subscribe((response) => {
            this.currentColorId = response.data.id; // Guarda el id del color actual
            this.colorForm.patchValue(response.data);
          });
        this.action = 'Edit'; // Establece la acción como 'Edit'
      } else {
        this.action = 'Create'; // Establece la acción como 'Create' si no hay ID
      }
    });
  }

  onSubmit() {
    if (this.action === 'Create') {
      // Si la acción es 'Create', llama al servicio para crear una nuevo color
      this.apiService
        .create('colores', this.colorForm.value)
        .subscribe((response) => {
          this.colorCreatedOrModifiedService.notifyColorCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar el color existente
      this.apiService
        .update('colores', this.currentColorId, this.colorForm.value)
        .subscribe((response) => {
          this.colorCreatedOrModifiedService.notifyColorCreatedOrModified();
        });
    }
    this.colorCreatedOrModifiedService.isDataLoaded = true;
    this.navigateToColors();
  }

  navigateToColors(): void {
    this.router.navigate(['/colores']); // Navega a la lista de colores
  }
}
