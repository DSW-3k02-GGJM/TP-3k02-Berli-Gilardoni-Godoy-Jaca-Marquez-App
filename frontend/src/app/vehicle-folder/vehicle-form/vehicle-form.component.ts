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

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class VehicleFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentVehicleId: number = -1;
  action: string = '';
  vehicleModels: any[] = [];
  colors: any[] = [];
  locations: any[] = [];

  constructor(
    private apiService: ApiService,
    private vehicleCreatedOrModifiedService: VehicleCreatedOrModifiedService,
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
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

    if (this.currentVehicleId != -1) {
      this.apiService
        .getOne('vehicles', Number(this.currentVehicleId))
        .subscribe((response) => {
          this.vehicleForm.patchValue({
            ...response.data,
            vehicleModel: response.data.vehicleModel.id,
            color: response.data.color.id,
            location: response.data.location.id,
            imagePath: response.data.imagePath, // Asigna la ruta de la imagen
          });
        });
      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
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
    if (this.vehicleForm.valid) {

      const formData = this.vehicleForm.value;

      console.log('Datos enviados:', formData); // para ver los datos que se envían
      this.activeModal.close();

      if (this.action === 'Create') {
        this.apiService.create('vehicles', formData).subscribe((response) => {
          this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
        });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('vehicles', this.currentVehicleId, formData)
          .subscribe((response) => {
            this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
          });
      }

      this.vehicleCreatedOrModifiedService.isDataLoaded = true;
    }
  }

}

