import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service.js';
import { ResCreatedOrModifiedService } from '../res-created-or-modified/res.service.js';
import { provideNativeDateAdapter } from '@angular/material/core';
import { VehicleCardComponent } from '../../vehicle-folder/vehicle-card/vehicle-card.component.js';
import { formatDate } from '@angular/common';
import { StepperSelectionEvent } from '@angular/cdk/stepper';


@Component({
  selector: 'app-res-stepper',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatStepperModule,
    VehicleCardComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './res-stepper.component.html',
  styleUrl: './res-stepper.component.scss'
})
export class ResStepperComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 700;
  }
  locations: any[] = [];
  response: any[] = [];
  isSmallScreen = window.innerWidth < 768;
  
  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  vehicleFilterForm: FormGroup = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    plannedEndDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  }, { validators: this.dateLessThan('startDate', 'plannedEndDate') });

  vehicleForm = new FormGroup({
    licensePlate: new FormControl('', [Validators.required]),
  }, { validators: this.dateLessThan('startDate', 'plannedEndDate') });

  //valida que startDate >= fecha actual y valida que startDate < plannedEndDate
  dateLessThan(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl) => {
      const startDate = formGroup.get(startDateField)?.value;
      const endDate = formGroup.get(endDateField)?.value;
      const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

      if (startDate && new Date(startDate) < new Date(today)) {
        formGroup.get(startDateField)?.setErrors({ dateInvalid: 'La fecha de inicio debe ser igual o mayor a la fecha actual' });
      } else if (startDate && endDate && startDate > endDate) {
        formGroup.get(endDateField)?.setErrors({ dateInvalid: true });
      } else if (!endDate) {
        formGroup.get(endDateField)?.setErrors({ dateInvalid: true });
      } else {
        formGroup.get(endDateField)?.setErrors(null);
      }
      return null;
    };
    
  }
  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 1) { // Índice del paso "Seleccionar modelo"
      this.setFilter();
    }
  }

  loadLocations(): void {
    this.apiService.getAll('locations').subscribe((response) => {
      this.locations = response.data;
    });
  }

  fetchVehicles(filter: any) {
    this.httpClient.get<any>(`/api/vehicles/available?startDate=${filter.startDate}&endDate=${filter.endDate}&location=${filter.location}`).subscribe(response => {
      console.log('Response data:', response);
      this.response = response.data.map((vehicleModel: any) => {
        console.log('Vehicle data:', vehicleModel);
        return {
          vehicleModel: vehicleModel.vehicleModelName,
          category: vehicleModel.category.categoryName,
          passengerCount: vehicleModel.passengerCount,
          image: vehicleModel.imagePath,
          pricePerDay: vehicleModel.category.pricePerDay,
          deposit: vehicleModel.category.depositValue,
        };
      });
      console.log('Mapped response:', this.response);
    }, error => {
      console.error('Error fetching vehicles:', error);
    });
  }
  setFilter() {
  
    if (!this.vehicleFilterForm.invalid) {
      const formValues = this.vehicleFilterForm.value;
      const formattedStartDate = formValues.startDate ? formatDate(formValues.startDate, 'yyyy-MM-dd', 'en-US') : '';
      const formattedPlannedEndDate = formValues.plannedEndDate ? formatDate(formValues.plannedEndDate, 'yyyy-MM-dd', 'en-US') : '';
      const filter = { 
        startDate: formattedStartDate, 
        endDate: formattedPlannedEndDate, 
        location: this.vehicleFilterForm.value.location,
       }
      console.log('Filter:', filter);
      this.fetchVehicles(filter);
    }

  }

  formatDate(DateDB: string): string {
    let DateFormat: string = '${year}-${month}-${day}';
    DateFormat = DateFormat.replace(
      '${year}',
      DateDB.substring(0, 4)
    );
    DateFormat = DateFormat.replace(
      '${month}',
      DateDB.substring(5, 7)
    );
    DateFormat = DateFormat.replace(
      '${day}',
      DateDB.substring(8, 10)
    );
    return DateFormat;
  }
}
