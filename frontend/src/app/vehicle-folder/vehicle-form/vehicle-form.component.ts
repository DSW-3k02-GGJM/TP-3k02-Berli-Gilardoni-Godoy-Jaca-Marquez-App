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
import { VehicleCreatedOrModifiedService } from '../vehicle-created-or-modified/vehicle.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  templateUrl: './vehicle-form.component.html',
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
export class VehicleFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentVehicleId: number = -1;
  action: string = '';
  errorMessage: string = '';

  vehicleModels: any[] = [];
  colors: any[] = [];
  locations: any[] = [];

  constructor(
    private apiService: ApiService,
    private vehicleCreatedOrModifiedService: VehicleCreatedOrModifiedService,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  vehicleForm = new FormGroup({
    licensePlate: new FormControl('', [Validators.required]),
    manufacturingYear: new FormControl('', [Validators.required]),
    totalKms: new FormControl('', [Validators.required]),
    vehicleModel: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.vehicleCreatedOrModifiedService.isDataLoaded = false;

    this.loadVehicleModels();
    this.loadColors();
    this.loadLocations();

    this.activatedRoute.params.subscribe(params => {
      this.currentVehicleId = params['id'];
   
      if (this.currentVehicleId) {
        this.apiService
          .getOne('vehicles', Number(this.currentVehicleId)) 
          .subscribe((response) => {
            this.vehicleForm.patchValue({
              ...response.data,
              vehicleModel: response.data.vehicleModel.id,
              color: response.data.color.id,
              location: response.data.location.id,
            });
          });
        this.action = 'Edit'; 
        this.title = 'Editar vehículo';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create'; 
        this.title = 'Nuevo vehículo';
        this.buttonText = 'Registrar';
      }
    });
  }

  loadVehicleModels(): void {
    this.apiService.getAll('vehicleModels').subscribe((response) => {
      this.vehicleModels = response.data;
    });
  }

  loadColors(): void {
    this.apiService.getAll('colors').subscribe((response) => {
      this.colors = response.data;
    });
  }

  loadLocations(): void {
    this.apiService.getAll('locations').subscribe((response) => {
      this.locations = response.data;
    });
  }

  onSubmit() {
    if (!this.vehicleForm.invalid) {

      const formData = this.vehicleForm.value;

      console.log('Datos enviados:', formData); // para ver los datos que se envían

      if (this.action === 'Create') {
        this.apiService
        .create('vehicles', formData)
        .subscribe({
          next: response => {
            this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
            this.navigateToVehicles();
          },
          error: error => {
            if (error.status !== 400) {
              this.errorMessage = "Error en el servidor. Intente de nuevo.";
            }
          }
        });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('vehicles', this.currentVehicleId, formData)
          .subscribe({
            next: response => {
              this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
              this.navigateToVehicles();
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

  navigateToVehicles() {
    this.router.navigate(['/staff/vehiclesS']);
  }

}

