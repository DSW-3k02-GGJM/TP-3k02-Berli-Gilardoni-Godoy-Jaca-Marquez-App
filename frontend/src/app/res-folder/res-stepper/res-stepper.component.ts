import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MatStepper } from '@angular/material/stepper';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericSuccesDialogComponent } from '../../shared/generic-succes-dialog/generic-succes-dialog.component.js';
import { differenceInDays } from 'date-fns';

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
    VehicleCardComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './res-stepper.component.html',
  styleUrl: './res-stepper.component.scss',
})
export class ResStepperComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GenericSuccesDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Reserva exitosa',
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 700;
  }
  @ViewChild('stepper') stepper!: MatStepper;

  locations: any[] = [];
  response: any[] = [];
  isSmallScreen = window.innerWidth < 768;

  startDate: string = '';
  plannedEndDate: string = '';
  location: string = '';
  vehicleModel = '';
  categoryDescription: string = '';
  passengerCount: number = 0;
  pricePerDay: number = 0;
  deposit: number = 0;
  brand: number = 0;

  vehicleID: number = 0;

  finalPrice: number = 0;

  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.loadLocations();
    this.vehicleFilterForm.get('startDate')?.valueChanges.subscribe((value) => {
      this.startDate = value ? formatDate(value, 'dd/MM/yyyy', 'en-US') : '';
    });
    this.vehicleFilterForm
      .get('plannedEndDate')
      ?.valueChanges.subscribe((value) => {
        this.plannedEndDate = value
          ? formatDate(value, 'dd/MM/yyyy', 'en-US')
          : '';
      });
    this.vehicleFilterForm.get('location')?.valueChanges.subscribe((value) => {
      const selectedLocation = this.locations.find(
        (location) => location.id === value
      );
      this.location = selectedLocation ? selectedLocation.locationName : '';
    });
  }

  vehicleFilterForm: FormGroup = new FormGroup(
    {
      startDate: new FormControl('', [Validators.required]),
      plannedEndDate: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    },
    { validators: this.dateLessThan('startDate', 'plannedEndDate') }
  );

  vehicleModelForm = new FormGroup(
    {
      vehicleModel: new FormControl('', [Validators.required]),
    },
    { validators: this.dateLessThan('startDate', 'plannedEndDate') }
  );

  onModelSelected(vehicleModel: any) {
    this.vehicleModel = vehicleModel.vehicleModel;
    this.categoryDescription = vehicleModel.categoryDescription;
    this.passengerCount = vehicleModel.passengerCount;
    this.pricePerDay = vehicleModel.pricePerDay;
    this.deposit = vehicleModel.deposit;

    this.response.forEach((vehicleModel) => {
      if (vehicleModel.vehicleModel === this.vehicleModel) {
        this.vehicleID = vehicleModel.vehicle.id;
        this.brand = vehicleModel.brand;
      }
    });

    this.vehicleModelForm
      .get('vehicleModel')
      ?.setValue(vehicleModel.vehicleModel);
    this.stepper.next();
  }

  //valida que startDate >= fecha actual y valida que startDate < plannedEndDate
  dateLessThan(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl) => {
      const startDate = formGroup.get(startDateField)?.value;
      const endDate = formGroup.get(endDateField)?.value;
      const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

      if (startDate && new Date(startDate) < new Date(today)) {
        formGroup.get(startDateField)?.setErrors({
          dateInvalid:
            'La fecha de inicio debe ser igual o mayor a la fecha actual',
        });
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
    if (event.selectedIndex === 1) {
      // Índice del paso "Seleccionar modelo"
      this.setFilter();
    } else if ((event.selectedIndex = 2)) {
      this.finalPrice = this.calculatePrice(
        this.startDate,
        this.plannedEndDate,
        this.pricePerDay
      );
    }
  }

  loadLocations(): void {
    this.apiService.getAll('locations').subscribe((response) => {
      this.locations = response.data;
    });
  }

  fetchVehicles(filter: any) {
    this.httpClient
      .get<any>(
        `/api/vehicles/available?startDate=${filter.startDate}&endDate=${filter.endDate}&location=${filter.location}`
      )
      .subscribe(
        (response) => {
          console.log('Response data:', response);
          this.response = response.data.map((vm: any) => {
            console.log('Vehicle model data:', vm);
            return {
              vehicleModel: vm.vehicleModel,
              category: vm.vehicle.vehicleModel.category.categoryName,
              passengerCount: vm.vehicle.vehicleModel.passengerCount,
              image: vm.vehicle.vehicleModel.imagePath,
              pricePerDay: vm.vehicle.vehicleModel.category.pricePerDay,
              deposit: vm.vehicle.vehicleModel.category.depositValue,
              vehicle: vm.vehicle,
              brand: vm.vehicle.brand,
            };
          });
          console.log('Mapped response:', this.response);
        },
        (error) => {
          console.error('Error fetching vehicles:', error);
        }
      );
  }
  setFilter() {
    if (!this.vehicleFilterForm.invalid) {
      const formValues = this.vehicleFilterForm.value;
      const formattedStartDate = formValues.startDate
        ? formatDate(formValues.startDate, 'yyyy-MM-dd', 'en-US')
        : '';
      const formattedPlannedEndDate = formValues.plannedEndDate
        ? formatDate(formValues.plannedEndDate, 'yyyy-MM-dd', 'en-US')
        : '';
      const filter = {
        startDate: formattedStartDate,
        endDate: formattedPlannedEndDate,
        location: this.vehicleFilterForm.value.location,
      };
      console.log('Filter:', filter);
      this.fetchVehicles(filter);
    }
  }

  formatDate(DateDB: string): string {
    let DateFormat: string = '${year}-${month}-${day}';
    DateFormat = DateFormat.replace('${year}', DateDB.substring(0, 4));
    DateFormat = DateFormat.replace('${month}', DateDB.substring(5, 7));
    DateFormat = DateFormat.replace('${day}', DateDB.substring(8, 10));
    return DateFormat;
  }

  formatDateForFinalPriceCalculation(date: string): Date {
    let DateFormat: string = '${year}-${month}-${day}';
    DateFormat = DateFormat.replace('${year}', date.substring(6, 10));
    DateFormat = DateFormat.replace('${month}', date.substring(3, 5));
    DateFormat = DateFormat.replace('${day}', date.substring(0, 2));
    return new Date(DateFormat);
  }

  calculatePrice(
    startDateAsString: string,
    plannedEndDateAsString: string,
    pricePerDay: number
  ): number {
    const formattedStartDate =
      this.formatDateForFinalPriceCalculation(startDateAsString);

    const formattedPlannedEndDate = this.formatDateForFinalPriceCalculation(
      plannedEndDateAsString
    );

    // Calcular la diferencia en días y el precio
    const days = differenceInDays(formattedPlannedEndDate, formattedStartDate);

    return days * pricePerDay;
  }

  submitRes() {
    const formValues = this.vehicleFilterForm.value;
    const formattedStartDate = formValues.startDate
      ? formatDate(formValues.startDate, 'yyyy-MM-dd', 'en-US')
      : '';
    const formattedPlannedEndDate = formValues.plannedEndDate
      ? formatDate(formValues.plannedEndDate, 'yyyy-MM-dd', 'en-US')
      : '';

    const resData = {
      reservationDate: new Date().toISOString().split('T')[0],
      startDate: formattedStartDate,
      plannedEndDate: formattedPlannedEndDate,
      vehicle: this.vehicleID,
    };

    this.apiService.createUserReservation(resData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.openDialog();
      },
      error: (error) => {
        console.log('Error:', error);
        if (error.status !== 400) {
          this.errorMessage = 'Error en el servidor. Intente de nuevo.';
        }
      },
    });
  }
}
