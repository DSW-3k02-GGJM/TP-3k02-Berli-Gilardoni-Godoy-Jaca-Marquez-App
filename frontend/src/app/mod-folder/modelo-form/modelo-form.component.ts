import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ModeloCreatedOrModifiedService } from '../modelo-created-or-modified/mod.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modelo-form',
  standalone: true,
  templateUrl: './modelo-form.component.html',
  styleUrls: ['./modelo-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class ModeloFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentModeloId: number = -1;
  action: string = '';
  categorias: any[] = []; // Agrega esta propiedad para almacenar las categorías
  marcas: any[] = [];

  constructor(
    private apiService: ApiService,
    private modeloCreatedOrModifiedService: ModeloCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  modeloForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    tipoTransmision: new FormControl('', [Validators.required]),
    cantPasajeros: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]), // Campo para la categoría
    marca: new FormControl('', [Validators.required]), // Campo para la marca
  });

  ngOnInit(): void {
    // Inicializa la variable isDataLoaded en el servicio para indicar que los datos aún no han sido cargados.
    this.modeloCreatedOrModifiedService.isDataLoaded = false;

    // Llama al método loadCategorias() para obtener la lista de categorías disponibles desde el backend
    // y almacenarlas en una propiedad del componente para usar en el formulario.
    this.loadCategorias();
    this.loadMarcas();

    if (this.currentModeloId != -1) {
      // Si el parámetro 'id' está presente en la ruta, significa que estamos en el modo de edición.
      // Realiza una solicitud al backend para obtener los detalles del modelo con el ID proporcionado.
      this.apiService
        .getOne('modelos', Number(this.currentModeloId))
        .subscribe((response) => {
          // Usa el método patchValue para actualizar el formulario con los datos del modelo recibido.
          // Asigna los valores del modelo a los campos del formulario, incluyendo 'categoria' y 'marca'.
          this.modeloForm.patchValue({
            ...response.data,
            categoria: response.data.categoria.id, // Asume que `categoriaId` es el ID de la categoría seleccionada.
            marca: response.data.marca.id, // Asume que `marcaId` es el ID de la marca seleccionada.
          });
        });

      // Establece la acción como 'Edit' para indicar que estamos editando un modelo existente.
      this.action = 'Edit';
    } else {
      // Si no hay un parámetro 'id' en la ruta, significa que estamos en el modo de creación de un nuevo modelo.
      // Establece la acción como 'Create'.
      this.action = 'Create';
    }
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
    this.activeModal.close();
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
  }
}