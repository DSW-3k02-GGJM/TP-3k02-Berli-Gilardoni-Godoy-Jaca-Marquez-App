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
import { MarcaCreatedOrModifiedService } from '../marca-created-or-modified/marca-created-or-modified.service';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class MarcaFormComponent implements OnInit {
  action: string = ''; // Acción actual (Create o Edit)
  currentMarcaId: any; // Id de la marca actual (para edición)

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private router: Router, // Servicio para manejar la navegación
    private activatedRoute: ActivatedRoute, // Servicio para acceder a los parámetros de la ruta
    private marcaCreatedOrModifiedService: MarcaCreatedOrModifiedService
  ) {}

  marcaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.marcaCreatedOrModifiedService.isDataLoaded = false;

    // Se ejecuta al inicializar el componente
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        // Si hay un ID en los parámetros, es una edición
        this.apiService
          .getOne('marcas', Number(params.id)) // Obtiene los datos de la marca por ID
          .subscribe((response) => {
            this.currentMarcaId = response.data.id; // Guarda el id de la marca actual
            this.marcaForm.patchValue(response.data);
          });
        this.action = 'Edit'; // Establece la acción como 'Edit'
      } else {
        this.action = 'Create'; // Establece la acción como 'Create' si no hay ID
      }
    });
  }

  onSubmit() {
    if (this.action === 'Create') {
      // Si la acción es 'Create', llama al servicio para crear una nueva marca
      this.apiService
        .create('marcas', this.marcaForm.value)
        .subscribe((response) => {
          this.marcaCreatedOrModifiedService.notifyMarcaCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar la marca existente
      this.apiService
        .update('marcas', this.currentMarcaId, this.marcaForm.value)
        .subscribe((response) => {
          this.marcaCreatedOrModifiedService.notifyMarcaCreatedOrModified();
        });
    }
    this.marcaCreatedOrModifiedService.isDataLoaded = true;
    this.navigateToMarcas();
  }

  navigateToMarcas(): void {
    this.router.navigate(['/marcas']); // Navega a la lista de marcas
  }
}
