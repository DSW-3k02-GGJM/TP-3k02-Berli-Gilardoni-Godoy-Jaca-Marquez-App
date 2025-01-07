// Angular
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { LicensePlateValidationService } from '@shared/services/validations/license-plate-validation.service';

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

  vehicleModels: any[] = [];
  colors: any[] = [];
  locations: any[] = [];

  vehicleForm = new FormGroup(
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
    private apiService: ApiService,
    private snackBarService: SnackBarService,
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
          this.apiService
            .getOne('vehicles', Number(this.currentVehicleId))
            .subscribe({
              next: (response) => {
                this.vehicleForm.patchValue({
                  ...response.data,
                  vehicleModel: response.data.vehicleModel.id,
                  color: response.data.color.id,
                  location: response.data.location.id,
                });
              },
              error: () => {
                this.displayedMessage = '⚠️ Error de conexión';
              },
            });
          this.vehicleForm.controls['licensePlate'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator(
              'vehicles',
              this.currentVehicleId
            ),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nuevo vehículo';
          this.buttonText = 'Registrar';
          this.vehicleForm.controls['licensePlate'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator('vehicles', -1),
          ]);
        }
      },
    });
  }

  loadData(): void {
    forkJoin({
      vehicleModels: this.apiService.getAll('vehicle-models'),
      colors: this.apiService.getAll('colors'),
      locations: this.apiService.getAll('locations'),
    }).subscribe({
      next: (response) => {
        this.vehicleModels = response.vehicleModels.data;
        this.colors = response.colors.data;
        this.locations = response.locations.data;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  get hasRelatedEntities(): boolean {
    return [this.vehicleModels, this.colors, this.locations].every(
      (array) => array.length > 0
    );
  }

  onSubmit() {
    if (!this.vehicleForm.invalid) {
      this.pending = true;
      if (this.action === 'Create') {
        this.apiService.create('vehicles', this.vehicleForm.value).subscribe({
          next: () => {
            this.pending = false;
            this.navigateToVehicles();
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
          .update('vehicles', this.currentVehicleId, this.vehicleForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToVehicles();
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
  }

  navigateToVehicles() {
    this.router.navigate(['/staff/vehicles']);
  }
}
