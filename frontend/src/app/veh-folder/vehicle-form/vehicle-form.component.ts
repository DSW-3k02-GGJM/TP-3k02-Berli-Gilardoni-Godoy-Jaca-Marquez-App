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
import { VehicleCreatedOrModifiedService } from '../vehicle-created-or-modified/vehicle.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class VehicleFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentVehicleId: number = -1;
  action: string = '';
  modelos: any[] = []; // Agrega esta propiedad para almacenar las categorías
  colors: any[] = [];
  sucursals: any[] = [];

  constructor(
    private apiService: ApiService,
    private vehicleCreatedOrModifiedService: VehicleCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  vehicleForm = new FormGroup({
    patente: new FormControl('', [Validators.required]),
    anioFabricacion: new FormControl('', [Validators.required]),
    kmRecorridos: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]), // Campo para la categoría
    color: new FormControl('', [Validators.required]), // Campo para la marca
    sucursal: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    // Inicializa la variable isDataLoaded en el servicio para indicar que los datos aún no han sido cargados.
    this.vehicleCreatedOrModifiedService.isDataLoaded = false;

    // Llama al método loadCategorias() para obtener la lista de categorías disponibles desde el backend
    // y almacenarlas en una propiedad del componente para usar en el formulario.
    this.loadModelos();
    this.loadColores();
    this.loadSucursales();

    if (this.currentVehicleId != -1) {
      // Si el parámetro 'id' está presente en la ruta, significa que estamos en el modo de edición.
      // Realiza una solicitud al backend para obtener los detalles del modelo con el ID proporcionado.
      this.apiService
        .getOne('vehiculos', Number(this.currentVehicleId))
        .subscribe((response) => {
          // Usa el método patchValue para actualizar el formulario con los datos del modelo recibido.
          // Asigna los valores del modelo a los campos del formulario.
          this.vehicleForm.patchValue({
            ...response.data,
            modelo: response.data.modelo.id, 
            color: response.data.color.id,
            sucursal: response.data.sucursal.id, 
          });
        });

      // Establece la acción como 'Edit' para indicar que estamos editando un modelo existente.
      this.action = 'Edit';
    } else {
      // Si no hay un parámetro 'id' en la ruta, significa que estamos en el modo de creación.
      // Establece la acción como 'Create'.
      this.action = 'Create';
    }
  }

  // Método para cargar
  loadModelos(): void {
    this.apiService.getAll('modelos').subscribe((response) => {
      this.modelos = response.data;
    });
  }

  // Método para cargar
  loadColores(): void {
    this.apiService.getAll('colores').subscribe((response) => {
      this.colors = response.data;
    });
  }

  // Método para cargar
  loadSucursales(): void {
    this.apiService.getAll('sucursales').subscribe((response) => {
      this.sucursals = response.data;
    });
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action === 'Create') {
      this.apiService
        .create('vehiculos', this.vehicleForm.value)
        .subscribe((response) => {
          this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      this.apiService
        .update('vehiculos', this.currentVehicleId, this.vehicleForm.value)
        .subscribe((response) => {
          this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
        });
    }
    this.vehicleCreatedOrModifiedService.isDataLoaded = true;
  }
}
