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
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

// RxJS
import { forkJoin } from 'rxjs';

// Services
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { ColorApiService } from '@core/color/services/color.api.service';
import { LocationApiService } from '@core/location/services/location.api.service';
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { LicensePlateValidationService } from '@shared/services/validations/license-plate-validation.service';

// Interfaces
import { VehicleResponse } from '@core/vehicle/interfaces/vehicle-response.interface';
import { VehicleInput } from '@core/vehicle/interfaces/vehicle-input.interface';
import { Brand } from '@core/brand/interfaces/brand.interface';
import { Color } from '@core/color/interfaces/color.interface';
import { Location } from '@core/location/interfaces/location.interface';
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { ForkJoinResponse } from '@core/vehicle/interfaces/fork-join-response.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  templateUrl: './vehicle-form.component.html',
  styleUrl: '../../../../shared/styles/genericForm.scss',
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
  title: string = '';
  buttonText: string = '';
  currentVehicleId: number = -1;
  action: string = '';
  displayedMessage: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  dataLoadError: boolean = false;

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
      ]),
      totalKms: new FormControl('', [Validators.required, Validators.min(0)]),
      vehicleModel: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private vehicleApiService: VehicleApiService,
    private colorApiService: ColorApiService,
    private locationApiService: LocationApiService,
    private vehicleModelApiService: VehicleModelApiService,
    private licensePlateValidationService: LicensePlateValidationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentVehicleId = params['id'];
        if (this.currentVehicleId) {
          this.action = 'Edit';
          this.title = 'Editar vehículo';
          this.buttonText = 'Guardar cambios';
          this.vehicleApiService.getOne(this.currentVehicleId).subscribe({
            next: (response: VehicleResponse) => {
              this.vehicleForm.patchValue({
                ...response.data,
                color: this.getColorId(response.data.color),
                location: this.getLocationId(response.data.location),
                vehicleModel: this.getVehicleModelId(
                  response.data.vehicleModel
                ),
              });
            },
            error: () => {
              this.displayedMessage = '⚠️ Error de conexión';
            },
          });
          this.vehicleForm.controls['licensePlate'].setAsyncValidators([
            this.vehicleApiService.uniqueLicensePlateValidator(
              this.currentVehicleId
            ),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nuevo vehículo';
          this.buttonText = 'Registrar';
          this.vehicleForm.controls['licensePlate'].setAsyncValidators([
            this.vehicleApiService.uniqueLicensePlateValidator(-1),
          ]);
        }
      },
    });
  }

  loadData(): void {
    forkJoin({
      colors: this.colorApiService.getAll(),
      locations: this.locationApiService.getAll(),
      vehicleModels: this.vehicleModelApiService.getAll(),
    }).subscribe({
      next: (response: ForkJoinResponse) => {
        this.colors = response.colors.data;
        this.locations = response.locations.data;
        this.vehicleModels = response.vehicleModels.data;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
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

  getColorId(color: Color | number | undefined): number {
    return typeof color === 'object' ? color.id : -1;
  }

  getLocationId(location: Location | number | undefined): number {
    return typeof location === 'object' ? location.id : -1;
  }

  getVehicleModelId(vehicleModel: VehicleModel | undefined): number {
    return typeof vehicleModel === 'object' ? vehicleModel.id : -1;
  }

  onSubmit(): void {
    if (!this.vehicleForm.invalid) {
      this.pending = true;
      if (this.action === 'Create') {
        this.vehicleApiService
          .create(this.vehicleForm.value as VehicleInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToVehicles();
            },
            error: (error: HttpErrorResponse) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      } else if (this.action === 'Edit') {
        this.vehicleApiService
          .update(this.currentVehicleId, this.vehicleForm.value as VehicleInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToVehicles();
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
  }

  navigateToVehicles(): void {
    this.router.navigate(['/staff/vehicles']);
  }
}
