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
import { LocationCreatedOrModifiedService } from '../location-created-or-modified/location.service.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-location-form',
  standalone: true,
  templateUrl: './location-form.component.html',
  styleUrl: '../../styles/genericForm.scss',
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
export class LocationFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentLocationId: number = -1;
  action: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private locationCreatedOrModifiedService: LocationCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  locationForm = new FormGroup({
    locationName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]), //TODO: añadir validador de telefono
  });

  ngOnInit(): void {
    this.locationCreatedOrModifiedService.isDataLoaded = false;

    this.activatedRoute.params.subscribe(params => {
      this.currentLocationId = params['id'];
   
      if (this.currentLocationId) {
        this.apiService
          .getOne('locations', Number(this.currentLocationId)) 
          .subscribe((response) => {
            this.locationForm.patchValue(response.data);
          });
        this.action = 'Edit'; 
        this.title = 'Editar sucursal';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create'; 
        this.title = 'Nueva sucursal';
        this.buttonText = 'Registrar';
      }
    });
  }

  onSubmit() {
    if(!this.locationForm.invalid) {
      if (this.action == 'Create') {
        this.apiService
          .create('locations', this.locationForm.value)
          .subscribe({
            next: response => {
              this.locationCreatedOrModifiedService.notifyLocationCreatedOrModified();
              this.navigateToLocations();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      } else if (this.action == 'Edit') {
        this.apiService
          .update('locations', this.currentLocationId, this.locationForm.value)
          .subscribe({
            next: response => {
              this.locationCreatedOrModifiedService.notifyLocationCreatedOrModified();
              this.navigateToLocations();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      }
    }
  }

  navigateToLocations() {
    this.router.navigate(['/staff/locations']);
  }
}
