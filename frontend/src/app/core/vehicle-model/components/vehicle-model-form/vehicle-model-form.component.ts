// Angular
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

// RxJS
import { Observable, map } from 'rxjs';
import { forkJoin } from 'rxjs';

// Services
import { ApiService } from '@shared/services/api/api.service';

@Component({
  selector: 'app-vehicle-model-form',
  standalone: true,
  templateUrl: './vehicle-model-form.component.html',
  styleUrls: [
    './vehicle-model-form.component.scss',
    '../../../../shared/styles/genericForm.scss',
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
})
export class VehicleModelFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentVehicleModelId: number = -1;
  action: string = '';
  errorMessage: string = '';
  displayedMessage: string = '';
  pending: boolean = false;

  oldPath: string = '';
  selectedFile: File | null = null;

  categories: any[] = [];
  brands: any[] = [];

  vehicleModelForm = new FormGroup(
    {
      vehicleModelName: new FormControl('', [Validators.required]),
      transmissionType: new FormControl('', [Validators.required]),
      passengerCount: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      category: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      imagePath: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentVehicleModelId = params['id'];
        if (this.currentVehicleModelId) {
          this.action = 'Edit';
          this.title = 'Editar modelo';
          this.buttonText = 'Guardar cambios';
          this.apiService
            .getOne('vehicle-models', Number(this.currentVehicleModelId))
            .subscribe({
              next: (response) => {
                this.vehicleModelForm.patchValue({
                  vehicleModelName: response.data.vehicleModelName,
                  transmissionType: response.data.transmissionType,
                  passengerCount: response.data.passengerCount,
                  category: response.data.category.id,
                  brand: response.data.brand.id,
                  imagePath: response.data.imagePath,
                });
              },
              error: () => {
                this.displayedMessage = '⚠️ Error de conexión';
              },
            });
          this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators(
            [
              this.apiService.uniqueEntityNameValidator(
                'vehicle-models',
                this.currentVehicleModelId
              ),
            ]
          );
        } else {
          this.action = 'Create';
          this.title = 'Nuevo modelo';
          this.buttonText = 'Registrar';
          this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators(
            [this.apiService.uniqueEntityNameValidator('vehicle-models', -1)]
          );
        }
      },
    });
  }

  loadData(): void {
    forkJoin({
      categories: this.apiService.getAll('categories'),
      brands: this.apiService.getAll('brands'),
    }).subscribe({
      next: (response) => {
        this.categories = response.categories.data;
        this.brands = response.brands.data;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  get hasRelatedEntities(): boolean {
    return this.categories.length > 0 && this.brands.length > 0;
  }

  onFileSelected(event: Event): void {
    const imagePathControl = this.vehicleModelForm.get('imagePath');
    this.oldPath = imagePathControl?.value || '';
    const file = (event.target as HTMLInputElement)?.files?.[0] || null;
    imagePathControl?.setValue(file?.name || '');
    this.selectedFile = file;
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.httpClient
      .post<{ path: string }>('/api/upload', formData)
      .pipe(map((response) => response.path));
  }

  onSubmit() {
    if (!this.vehicleModelForm.invalid) {
      this.pending = true;

      if (this.selectedFile) {
        this.uploadImage(this.selectedFile).subscribe({
          next: (imagePath) => {
            this.vehicleModelForm.patchValue({ imagePath });
            this.submitForm(this.oldPath);
          },
          error: () => {
            this.pending = false;
            this.errorMessage = 'Error al subir la imagen. Intente de nuevo.';
          },
        });
      } else {
        this.submitForm(null);
      }
    }
  }

  submitForm(oldPath: string | null | undefined) {
    const formData = this.vehicleModelForm.value;
    if (oldPath) {
      this.httpClient.delete(`/api/upload/${oldPath}`).subscribe({
        next: () => {},
        error: (error) => {
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        },
      });
    }
    if (this.action === 'Create') {
      this.apiService.create('vehicle-models', formData).subscribe({
        next: () => {
          this.pending = false;
          this.navigateToVehicleModels();
        },
        error: (error) => {
          this.pending = false;
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        },
      });
    } else if (this.action === 'Edit') {
      this.apiService
        .update('vehicle-models', this.currentVehicleModelId, formData)
        .subscribe({
          next: () => {
            this.pending = false;
            this.navigateToVehicleModels();
          },
          error: (error) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
    }
  }

  navigateToVehicleModels() {
    this.router.navigate(['/staff/vehicle-models']);
  }
}
