import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { VehicleModelCreatedOrModifiedService } from '../vehicleModel-created-or-modified/vehicleModel.service.js';
import { VehicleModelService } from './vehicleModel.service';
import { map, Observable } from "rxjs";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicleModel-form',
  standalone: true,
  templateUrl: './vehicleModel-form.component.html',
  styleUrls: ['../../styles/genericForm.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [ApiService],
})
export class VehicleModelFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentVehicleModelId: number = -1;
  action: string = '';
  errorMessage: string = '';

  categories: any[] = []; // Agrega esta propiedad para almacenar las categorías
  brands: any[] = [];
  pending = false;
  selectedFile: File | null = null;

  constructor(
    private apiService: ApiService,
    private vehicleModelCreatedOrModifiedService: VehicleModelCreatedOrModifiedService,
    private vehicleModelService: VehicleModelService, // Inyecta el servicio
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  vehicleModelForm = new FormGroup({
    vehicleModelName: new FormControl('', [Validators.required]),
    transmissionType: new FormControl('', [Validators.required]),
    passengerCount: new FormControl('', [Validators.required, Validators.min(1)]),
    category: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    imagePath: new FormControl(''),
  }, { updateOn: 'submit' });

  ngOnInit(): void {
    // Inicializa la variable isDataLoaded en el servicio para indicar que los datos aún no han sido cargados.
    this.vehicleModelCreatedOrModifiedService.isDataLoaded = false;

    // Llama al métod0 loadCategorias() para obtener la lista de categorías disponibles desde el backend
    // y almacenarlas en una propiedad del componente para usar en el formulario.
    this.loadCategories();
    this.loadBrands();

    this.activatedRoute.params.subscribe(params => {
      this.currentVehicleModelId = params['id'];

      if (this.currentVehicleModelId) {
        this.apiService
          .getOne('vehicleModels', Number(this.currentVehicleModelId))
          .subscribe((response) => {
            this.vehicleModelForm.patchValue({
              vehicleModelName: response.data.vehicleModelName,
              transmissionType: response.data.transmissionType,
              passengerCount: response.data.passengerCount,
              category: response.data.category.id,
              brand: response.data.brand.id,
              imagePath: response.data.imagePath,});
          });
        this.action = 'Edit';
        this.title = 'Editar modelo';
        this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators([this.apiService.uniqueEntityNameValidator('vehicleModels',this.currentVehicleModelId)])
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create';
        this.title = 'Nuevo modelo';
        this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators([this.apiService.uniqueEntityNameValidator('vehicleModels',-1)])
        this.buttonText = 'Registrar';
      }
    });

  }

  // Métod0 para cargar las categorías
  loadCategories(): void {
    this.apiService.getAll('categories').subscribe((response) => {
      this.categories = response.data;
    });
  }

  // Métod0 para cargar las marcas
  loadBrands(): void {
    this.apiService.getAll('brands').subscribe((response) => {
      this.brands = response.data;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.httpClient.post<{ path: string }>('/api/upload', formData).pipe(
      map((response) => response.path)
    );
  }

  onSubmit() {
    if (!this.vehicleModelForm.invalid) {
      this.pending = true;

      if (this.selectedFile) {
        this.uploadImage(this.selectedFile).subscribe({
          next: (imagePath) => {
            const oldPath = this.vehicleModelForm.get('imagePath')?.value;
            console.log('oldPath', oldPath);

            this.vehicleModelForm.patchValue({ imagePath });
            this.submitForm(oldPath);
          },
          error: (error) => {
            this.pending = false;
            this.errorMessage = 'Error al subir la imagen. Intente de nuevo.';
          }
        });
      } else {
        this.submitForm(null);
      }
    }
  }

  submitForm(oldPath: string | null | undefined){
    const formData = this.vehicleModelForm.value;
    if (oldPath) {
      this.httpClient.delete(`/api/upload/${oldPath}`).subscribe({
        next: () => {
        },
        error: (error) => {
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        }
      });
    }
    if (this.action === 'Create') {
      this.apiService.create('vehicleModels', formData).subscribe({
        next: () => {
          this.pending = false;
          this.vehicleModelCreatedOrModifiedService.notifyVehicleModelCreatedOrModified();
          this.navigateToVehicleModels();
        },
        error: (error) => {
          this.pending = false;
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        }
      });
    } else if (this.action === 'Edit') {
      this.apiService.update('vehicleModels', this.currentVehicleModelId, formData).subscribe({
        next: () => {
          this.pending = false;
          this.vehicleModelCreatedOrModifiedService.notifyVehicleModelCreatedOrModified();
          this.navigateToVehicleModels();
        },
        error: (error) => {
          this.pending = false;
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        }
      });
    }
  }

  navigateToVehicleModels() {
    this.router.navigate(['/staff/vehicleModels']);
  }
}