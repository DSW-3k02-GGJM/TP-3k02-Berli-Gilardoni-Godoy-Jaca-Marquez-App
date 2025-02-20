// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
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
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { ColorApiService } from '@core/color/services/color.api.service';
import { LocationApiService } from '@core/location/services/location.api.service';
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { LicensePlateValidationService } from '@shared/services/validations/license-plate-validation.service';

// Interfaces
import { VehicleResponse } from '@core/vehicle/interfaces/vehicle-response.interface';
import { VehicleInput } from '@core/vehicle/interfaces/vehicle-input.interface';
import { Brand } from '@core/brand/interfaces/brand.interface';
import { Color } from '@core/color/interfaces/color.interface';
import { Location } from '@core/location/interfaces/location.interface';
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { ForkJoinResponse } from '@core/vehicle/interfaces/fork-join-response.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  templateUrl: './vehicle-form.component.html',
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
export class VehicleFormComponent implements OnInit {
  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentVehicleId: number = -1;
  pending: boolean = false;

  displayedMessage: boolean = false;

  colors: Color[] = [];
  locations: Location[] = [];
  vehicleModels: VehicleModel[] = [];

  vehicleForm: FormGroup = new FormGroup(
    {
      licensePlate: new FormControl('', [
        Validators.required,
        this.licensePlateValidationService.licensePlateValidation(),
      ]),
      manufacturingYear: new FormControl('', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear()),
        Validators.pattern(/^\d+$/),
      ]),
      totalKms: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/),
      ]),
      vehicleModel: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly vehicleApiService: VehicleApiService,
    private readonly colorApiService: ColorApiService,
    private readonly locationApiService: LocationApiService,
    private readonly vehicleModelApiService: VehicleModelApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly licensePlateValidationService: LicensePlateValidationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadRelatedData();
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentVehicleId = params['id'];

        const mode: string = this.currentVehicleId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.vehicleForm.controls['licensePlate'].setAsyncValidators([
          this.vehicleApiService.uniqueLicensePlateValidator(
            this.currentVehicleId
          ),
        ]);

        if (mode === 'Edit') {
          this.loadVehicleData();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nuevo vehículo' : 'Editar vehículo',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadRelatedData(): void {
    forkJoin({
      colors: this.colorApiService.getAll(),
      locations: this.locationApiService.getAll(),
      vehicleModels: this.vehicleModelApiService.getAll(),
    }).subscribe({
      next: (response: ForkJoinResponse) => {
        this.colors = response.colors.data;
        this.locations = response.locations.data;
        this.vehicleModels = response.vehicleModels.data;
        this.sortRelatedData();
      },
      error: () => this.handleRelatedLoadError(),
    });
  }

  private sortRelatedData(): void {
    this.colors = this.colors.sort((a: Color, b: Color) =>
      a.colorName.localeCompare(b.colorName)
    );

    this.locations = this.locations.sort((a: Location, b: Location) =>
      a.locationName.localeCompare(b.locationName)
    );

    this.vehicleModels = this.vehicleModels.sort(
      (a: VehicleModel, b: VehicleModel) =>
        `${a.brand?.brandName} ${a.vehicleModelName}`.localeCompare(
          `${b.brand?.brandName} ${b.vehicleModelName}`
        )
    );
  }

  private loadVehicleData(): void {
    this.vehicleApiService.getOne(this.currentVehicleId).subscribe({
      next: (response: VehicleResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  get hasRelatedEntities(): boolean {
    return [this.colors, this.locations, this.vehicleModels].every(
      (array) => array.length > 0
    );
  }

  getBrandName(brand: Brand | undefined): string {
    return typeof brand === 'object' ? brand.brandName : '';
  }

  private getColorId(color: Color | number | undefined): number {
    return typeof color === 'object' ? color.id : -1;
  }

  private getLocationId(location: Location | number | undefined): number {
    return typeof location === 'object' ? location.id : -1;
  }

  private getVehicleModelId(vehicleModel: VehicleModel | undefined): number {
    return typeof vehicleModel === 'object' ? vehicleModel.id : -1;
  }

  onSubmit(): void {
    if (!this.vehicleForm.invalid) {
      this.pending = true;
      this.getVehicleRequest().subscribe({
        next: (response: Message) => this.handleSubmitSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getVehicleRequest(): Observable<Message> {
    const data = this.vehicleForm.value as VehicleInput;
    return this.formData.action === 'Create'
      ? this.vehicleApiService.create(data)
      : this.vehicleApiService.update(this.currentVehicleId, data);
  }

  private handleLoadSuccess(response: VehicleResponse): void {
    this.vehicleForm.patchValue({
      ...response.data,
      color: this.getColorId(response.data.color),
      location: this.getLocationId(response.data.location),
      vehicleModel: this.getVehicleModelId(response.data.vehicleModel),
    });
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToVehicles();
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
    const goTo = error.status === 500 ? '/home' : '/staff/vehicles';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToVehicles(): void {
    this.router.navigate(['/staff/vehicles']);
  }
}
