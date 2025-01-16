// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { forkJoin } from 'rxjs';

// Services
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { CategoryApiService } from '@core/category/services/category.api.service';
import { ImageApiService } from '@shared/services/api/image.api.service';

// Interfaces
import { VehicleModelResponse } from '@core/vehicle-model/interfaces/vehicle-model-response.interface';
import { VehicleModelInput } from '@core/vehicle-model/interfaces/vehicle-model-input.interface';
import { Brand } from '@core/brand/interfaces/brand.interface';
import { Category } from '@core/category/interfaces/category.interface';
import { ForkJoinResponse } from '@core/vehicle-model/interfaces/fork-join-response.interface';
import { FormData } from '@shared/interfaces/form-data.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';
import { UploadImageResponse } from '@shared/interfaces/upload-image-response.interface';

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
    PreventEnterDirective,
  ],
})
export class VehicleModelFormComponent implements OnInit {
  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentVehicleModelId: number = -1;
  displayedMessage: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  oldPath: string = '';
  selectedFile: File | null = null;

  brands: Brand[] = [];
  categories: Category[] = [];

  vehicleModelForm: FormGroup = new FormGroup(
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
    private vehicleModelApiService: VehicleModelApiService,
    private brandApiService: BrandApiService,
    private categoryApiService: CategoryApiService,
    private imageApiService: ImageApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentVehicleModelId = params['id'];
        if (this.currentVehicleModelId) {
          this.assignFormData('Edit');
          this.vehicleModelApiService
            .getOne(this.currentVehicleModelId)
            .subscribe({
              next: (response: VehicleModelResponse) => {
                this.vehicleModelForm.patchValue({
                  ...response.data,
                  brand: this.getBrandId(response.data.brand),
                  category: this.getCategoryId(response.data.category),
                });
              },
              error: () => {
                this.displayedMessage = '⚠️ Error de conexión';
              },
            });
          this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators(
            [
              this.vehicleModelApiService.uniqueNameValidator(
                this.currentVehicleModelId
              ),
            ]
          );
        } else {
          this.assignFormData('Create');
          this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators(
            [this.vehicleModelApiService.uniqueNameValidator(-1)]
          );
        }
      },
    });
  }

  assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nuevo modelo' : 'Editar modelo',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  loadData(): void {
    forkJoin({
      brands: this.brandApiService.getAll(),
      categories: this.categoryApiService.getAll(),
    }).subscribe({
      next: (response: ForkJoinResponse) => {
        this.brands = response.brands.data;
        this.categories = response.categories.data;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  onFileSelected(event: Event): void {
    const file: File | null =
      (event.target as HTMLInputElement)?.files?.[0] || null;

    if (file) {
      const imagePathControl: AbstractControl | null =
        this.vehicleModelForm.get('imagePath');

      this.oldPath = imagePathControl?.value || '';
      imagePathControl?.setValue(file.name);
    }

    this.selectedFile = file;
  }

  get hasRelatedEntities(): boolean {
    return [this.brands, this.categories].every((array) => array.length > 0);
  }

  getBrandId(brand: Brand | undefined): number {
    return typeof brand === 'object' ? brand.id : -1;
  }

  getCategoryId(category: Category | number | undefined): number {
    return typeof category === 'object' ? category.id : -1;
  }

  onSubmit(): void {
    if (!this.vehicleModelForm.invalid) {
      this.pending = true;
      if (this.selectedFile) {
        this.imageApiService.uploadImage(this.selectedFile as File).subscribe({
          next: (response: UploadImageResponse) => {
            this.vehicleModelForm.patchValue({
              imagePath: response.imagePath ?? '',
            });
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

  deleteImageIfNeeded(oldPath: string | null): void {
    if (oldPath) {
      this.imageApiService.deleteImage(oldPath).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        },
      });
    }
  }

  submitForm(oldPath: string | null): void {
    this.deleteImageIfNeeded(oldPath);
    if (this.formData.action === 'Create') {
      this.vehicleModelApiService
        .create(this.vehicleModelForm.value as VehicleModelInput)
        .subscribe({
          next: () => {
            this.pending = false;
            this.navigateToVehicleModels();
          },
          error: (error: HttpErrorResponse) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
    } else if (this.formData.action === 'Edit') {
      this.vehicleModelApiService
        .update(
          this.currentVehicleModelId,
          this.vehicleModelForm.value as VehicleModelInput
        )
        .subscribe({
          next: () => {
            this.pending = false;
            this.navigateToVehicleModels();
          },
          error: (error: HttpErrorResponse) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
    }
  }

  navigateToVehicleModels(): void {
    this.router.navigate(['/staff/vehicle-models']);
  }
}
