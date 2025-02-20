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
import { forkJoin, Observable } from 'rxjs';

// Services
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { CategoryApiService } from '@core/category/services/category.api.service';
import { ImageApiService } from '@shared/services/api/image.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { VehicleModelResponse } from '@core/vehicle-model/interfaces/vehicle-model-response.interface';
import { VehicleModelInput } from '@core/vehicle-model/interfaces/vehicle-model-input.interface';
import { Brand } from '@core/brand/interfaces/brand.interface';
import { Category } from '@core/category/interfaces/category.interface';
import { ForkJoinResponse } from '@core/vehicle-model/interfaces/fork-join-response.interface';
import { UploadImageResponse } from '@shared/interfaces/upload-image-response.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-vehicle-model-form',
  standalone: true,
  templateUrl: './vehicle-model-form.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
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
  pending: boolean = false;

  displayedMessage: boolean = false;

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
        Validators.min(2),
        Validators.pattern(/^\d+$/),
      ]),
      category: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      imagePath: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly vehicleModelApiService: VehicleModelApiService,
    private readonly brandApiService: BrandApiService,
    private readonly categoryApiService: CategoryApiService,
    private readonly imageApiService: ImageApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadRelatedData();
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentVehicleModelId = params['id'];

        const mode: string = this.currentVehicleModelId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.vehicleModelForm.controls['vehicleModelName'].setAsyncValidators([
          this.vehicleModelApiService.uniqueNameValidator(
            this.currentVehicleModelId
          ),
        ]);

        if (mode === 'Edit') {
          this.loadVehicleModelData();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nuevo modelo' : 'Editar modelo',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadRelatedData(): void {
    forkJoin({
      brands: this.brandApiService.getAll(),
      categories: this.categoryApiService.getAll(),
    }).subscribe({
      next: (response: ForkJoinResponse) => {
        this.brands = response.brands.data;
        this.categories = response.categories.data;
        this.sortRelatedData();
      },
      error: () => this.handleRelatedLoadError(),
    });
  }

  private sortRelatedData(): void {
    this.brands = this.brands.sort((a: Brand, b: Brand) =>
      a.brandName.localeCompare(b.brandName)
    );

    this.categories = this.categories.sort((a: Category, b: Category) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  }

  private loadVehicleModelData(): void {
    this.vehicleModelApiService.getOne(this.currentVehicleModelId).subscribe({
      next: (response: VehicleModelResponse) =>
        this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  onFileSelected(event: Event): void {
    const file: File | null =
      (event.target as HTMLInputElement)?.files?.[0] || null;

    const imagePathControl: AbstractControl | null =
      this.vehicleModelForm.get('imagePath');

    const newValue: string = file
      ? file.name
      : this.currentVehicleModelId
      ? this.oldPath
      : '';

    imagePathControl?.setValue(newValue);

    this.selectedFile = file;
  }

  get hasRelatedEntities(): boolean {
    return [this.brands, this.categories].every((array) => array.length > 0);
  }

  private getBrandId(brand: Brand | undefined): number {
    return typeof brand === 'object' ? brand.id : -1;
  }

  private getCategoryId(category: Category | number | undefined): number {
    return typeof category === 'object' ? category.id : -1;
  }

  onSubmit(): void {
    if (!this.vehicleModelForm.invalid) {
      this.pending = true;

      if (this.selectedFile) {
        this.uploadImage();
      } else {
        this.submitForm(null);
      }
    }
  }

  private uploadImage(): void {
    this.imageApiService.uploadImage(this.selectedFile as File).subscribe({
      next: (response: UploadImageResponse) =>
        this.handleImageUploadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  submitForm(oldPath: string | null): void {
    this.deleteImageIfNeeded(oldPath);

    this.getVehicleModelRequest().subscribe({
      next: (response: Message) => this.handleSubmitSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  deleteImageIfNeeded(oldPath: string | null): void {
    if (oldPath) {
      this.imageApiService.deleteImage(oldPath).subscribe({
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getVehicleModelRequest(): Observable<Message> {
    const data = this.vehicleModelForm.value as VehicleModelInput;
    return this.formData.action === 'Create'
      ? this.vehicleModelApiService.create(data)
      : this.vehicleModelApiService.update(this.currentVehicleModelId, data);
  }

  private handleLoadSuccess(response: VehicleModelResponse): void {
    this.vehicleModelForm.patchValue({
      ...response.data,
      brand: this.getBrandId(response.data.brand),
      category: this.getCategoryId(response.data.category),
    });
    this.oldPath = response.data.imagePath;
  }

  private handleImageUploadSuccess(response: UploadImageResponse): void {
    this.vehicleModelForm.patchValue({
      imagePath: response.imagePath,
    });
    this.submitForm(this.oldPath);
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToVehicleModels();
  }

  private handleRelatedLoadError(): void {
    this.openDialogService.error({
      goTo: '/home',
    } as ErrorDialogOptions);
    this.displayedMessage = true;
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    if (!this.displayedMessage) {
      this.openErrorDialog(error);
    }
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    const goTo = error.status === 500 ? '/home' : '/staff/vehicle-models';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToVehicleModels(): void {
    this.router.navigate(['/staff/vehicle-models']);
  }
}
