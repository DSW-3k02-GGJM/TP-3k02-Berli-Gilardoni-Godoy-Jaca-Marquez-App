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
import { ModeloCreatedOrModifiedService } from '../modelo-created-or-modified/modelo-created-or-modified.service';

@Component({
  selector: 'app-modelo-form',
  standalone: true,
  templateUrl: './modelo-form.component.html',
  styleUrls: ['./modelo-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class ModeloFormComponent implements OnInit {
  action: string = '';
  currentModeloId: any;
  categorias: any[] = []; // Agrega esta propiedad para almacenar las categorías
  marcas: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modeloCreatedOrModifiedService: ModeloCreatedOrModifiedService
  ) {}

  modeloForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    tipoTransmision: new FormControl('', [Validators.required]),
    cantPasajeros: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),  // Campo para la categoría
    marca: new FormControl('', [Validators.required]),  // Campo para la  marca
  });

  ngOnInit(): void {
    // Inicializa la variable isDataLoaded en el servicio para indicar que los datos aún no han sido cargados.
    this.modeloCreatedOrModifiedService.isDataLoaded = false;
  
    // Llama al método loadCategorias() para obtener la lista de categorías disponibles desde el backend
    // y almacenarlas en una propiedad del componente para usar en el formulario.
    this.loadCategorias();
    this.loadMarcas();
  
    // Subscríbete a los parámetros de la ruta activa para manejar la lógica dependiendo de si el parámetro 'id' está presente o no.
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        // Si el parámetro 'id' está presente en la ruta, significa que estamos en el modo de edición.
        // Realiza una solicitud al backend para obtener los detalles del modelo con el ID proporcionado.
        this.apiService
          .getOne('modelos', Number(params.id))
          .subscribe((response) => {
            // Al recibir la respuesta del backend, actualiza la variable currentModeloId con el ID del modelo.
            this.currentModeloId = response.data.id;
            // Usa el método patchValue para actualizar el formulario con los datos del modelo recibido.
            // Asigna los valores del modelo a los campos del formulario, incluyendo 'categoria' y 'marca'.
            this.modeloForm.patchValue({
              ...response.data,
              categoria: response.data.categoriaId, // Asume que `categoriaId` es el ID de la categoría seleccionada.
              marca: response.data.marcaId, // Asume que `marcaId` es el ID de la marca seleccionada.
            });
          });
  
        // Establece la acción como 'Edit' para indicar que estamos editando un modelo existente.
        this.action = 'Edit';
      } else {
        // Si no hay un parámetro 'id' en la ruta, significa que estamos en el modo de creación de un nuevo modelo.
        // Establece la acción como 'Create'.
        this.action = 'Create';
      }
    });
  }

  // Método para cargar las categorías
  loadCategorias(): void {
    this.apiService.getAll('categorias').subscribe((response) => {
      this.categorias = response.data;
    });
  }

    // Método para cargar las categorías
    loadMarcas(): void {
      this.apiService.getAll('marcas').subscribe((response) => {
        this.marcas = response.data;
      });
    }

  onSubmit() {
    if (this.action === 'Create') {
      this.apiService
        .create('modelos', this.modeloForm.value)
        .subscribe((response) => {
          this.modeloCreatedOrModifiedService.notifyModeloCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      this.apiService
        .update('modelos', this.currentModeloId, this.modeloForm.value)
        .subscribe((response) => {
          this.modeloCreatedOrModifiedService.notifyModeloCreatedOrModified();
        });
    }
    this.modeloCreatedOrModifiedService.isDataLoaded = true;
    this.navigateToModelos();
  }

  navigateToModelos(): void {
    this.router.navigate(['/modelos']);
  }
}
