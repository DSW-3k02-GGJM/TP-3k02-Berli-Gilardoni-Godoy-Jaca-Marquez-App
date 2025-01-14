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

// Services
import { LocationApiService } from '@core/location/services/location.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { LocationResponse } from '@core/location/interfaces/location-response.interface';
import { LocationInput } from '@core/location/interfaces/location-input.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-location-form',
  standalone: true,
  templateUrl: './location-form.component.html',
  styleUrl: '../../../../shared/styles/genericForm.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    PreventEnterDirective,
  ],
})
export class LocationFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentLocationId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  locationForm: FormGroup = new FormGroup(
    {
      locationName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly locationApiService: LocationApiService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentLocationId = params['id'];
        if (this.currentLocationId) {
          this.action = 'Edit';
          this.title = 'Editar sucursal';
          this.buttonText = 'Guardar cambios';
          this.locationApiService.getOne(this.currentLocationId).subscribe({
            next: (response: LocationResponse) =>
              this.locationForm.patchValue(response.data),
            error: () =>
              this.snackBarService.show(
                'Error al obtener la información de la sucursal'
              ),
          });
          this.locationForm.controls['locationName'].setAsyncValidators([
            this.locationApiService.uniqueNameValidator(this.currentLocationId),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nueva sucursal';
          this.buttonText = 'Registrar';
          this.locationForm.controls['locationName'].setAsyncValidators([
            this.locationApiService.uniqueNameValidator(-1),
          ]);
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.locationForm.invalid) {
      this.pending = true;
      if (this.action == 'Create') {
        this.locationApiService
          .create(this.locationForm.value as LocationInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToLocations();
            },
            error: (error: HttpErrorResponse) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      } else if (this.action == 'Edit') {
        this.locationApiService
          .update(
            this.currentLocationId,
            this.locationForm.value as LocationInput
          )
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToLocations();
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

  navigateToLocations(): void {
    this.router.navigate(['/staff/locations']);
  }
}
