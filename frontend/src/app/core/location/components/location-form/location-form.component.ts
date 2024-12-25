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
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

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
  ],
})
export class LocationFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentLocationId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  locationForm = new FormGroup(
    {
      locationName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
      ]),
    },
    { updateOn: 'submit' }
  );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentLocationId = params['id'];
        if (this.currentLocationId) {
          this.action = 'Edit';
          this.title = 'Editar sucursal';
          this.buttonText = 'Guardar cambios';
          this.apiService
            .getOne('locations', Number(this.currentLocationId))
            .subscribe({
              next: (response) => this.locationForm.patchValue(response.data),
              error: () =>
                this.snackBarService.show(
                  'Error al obtener la información de la sucursal'
                ),
            });
          this.locationForm.controls['locationName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator(
              'locations',
              this.currentLocationId
            ),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nueva sucursal';
          this.buttonText = 'Registrar';
          this.locationForm.controls['locationName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator('locations', -1),
          ]);
        }
      },
    });
  }

  onSubmit() {
    if (!this.locationForm.invalid) {
      this.pending = true;
      if (this.action == 'Create') {
        this.apiService.create('locations', this.locationForm.value).subscribe({
          next: () => {
            this.pending = false;
            this.navigateToLocations();
          },
          error: (error) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
      } else if (this.action == 'Edit') {
        this.apiService
          .update('locations', this.currentLocationId, this.locationForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToLocations();
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

  navigateToLocations() {
    this.router.navigate(['/staff/locations']);
  }
}
