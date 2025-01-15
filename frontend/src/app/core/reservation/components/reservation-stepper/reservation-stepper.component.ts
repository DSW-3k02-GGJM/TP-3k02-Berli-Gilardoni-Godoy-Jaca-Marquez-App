// Angular
import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

// Services
import { AuthService } from '@security/services/auth.service';
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { LocationApiService } from '@core/location/services/location.api.service';
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { ImageApiService } from '@shared/services/api/image.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { ReservationDatesValidationService } from '@shared/services/validations/reservation-dates-validation.service';
import { VehicleCardTransformerService } from '@shared/services/formatters/vehicle-card-transformer.service';
import { ReservationPriceCalculationService } from '@shared/services/calculations/reservation-price-calculation.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { VehicleCardComponent } from '@core/vehicle/components/vehicle-card/vehicle-card.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { ReservationInput } from '@core/reservation/interfaces/reservation-input.interface';
import { ReservationFilter } from '@core/reservation/interfaces/reservation-filter.interface';
import { VehiclesResponse } from '@core/vehicle/interfaces/vehicles-response.interface';
import { VehicleCard } from '@core/vehicle/interfaces/vehicle-card.interface';
import { Location } from '@core/location/interfaces/location.interface';
import { LocationsResponse } from '@core/location/interfaces/locations-response.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-reservation-stepper',
  standalone: true,
  templateUrl: './reservation-stepper.component.html',
  styleUrl: './reservation-stepper.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatStepperModule,
    VehicleCardComponent,
    MatNativeDateModule,
    MatCardModule,
    PreventEnterDirective,
  ],
})
export class ReservationStepperComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isSmallScreen = this.isSmallScreenWidth();
  }
  @ViewChild('stepper') stepper!: MatStepper;

  isSmallScreen: boolean = this.isSmallScreenWidth();

  userRole: string = '';

  imageServerUrl: string = '';

  locations: Location[] = [];
  response: VehicleCard[] = [];

  startDate: string = '';
  endDate: string = '';
  location: string = '';

  vehicleID: number = 0;
  vehicleModel: string = '';
  category: string = '';
  passengerCount: number = 0;
  pricePerDay: number = 0;
  deposit: number = 0;
  brand: string = '';

  finalPrice: number = 0;

  errorMessage: string = '';
  displayedMessage: string = '';

  vehicleFilterForm: FormGroup = new FormGroup(
    {
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    },
    {
      validators:
        this.reservationDatesValidationService.reservationDatesValidation(
          'startDate',
          'endDate'
        ),
    }
  );

  vehicleModelForm: FormGroup = new FormGroup({
    vehicleModel: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly reservationApiService: ReservationApiService,
    private readonly locationApiService: LocationApiService,
    private readonly vehicleApiService: VehicleApiService,
    private readonly imageApiService: ImageApiService,
    private readonly snackBarService: SnackBarService,
    private readonly reservationDatesValidationService: ReservationDatesValidationService,
    private readonly vehicleCardTransformerService: VehicleCardTransformerService,
    private readonly reservationPriceCalculationService: ReservationPriceCalculationService,
    private readonly formatDateService: FormatDateService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUserRole();
    this.getImageServerUrl();
    this.loadLocations();
    this.vehicleFilterForm.get('startDate')?.valueChanges.subscribe({
      next: (value: Date | null) =>
        (this.startDate = value
          ? formatDate(value, 'dd/MM/yyyy', 'en-US')
          : ''),
    });
    this.vehicleFilterForm.get('endDate')?.valueChanges.subscribe({
      next: (value: Date | null) => {
        this.endDate = value ? formatDate(value, 'dd/MM/yyyy', 'en-US') : '';
      },
    });
    this.vehicleFilterForm.get('location')?.valueChanges.subscribe({
      next: (value: number | null) => {
        const selectedLocation = this.locations.find(
          (location: Location) => location.id === value
        );
        this.location = selectedLocation ? selectedLocation.locationName : '';
      },
    });
  }

  private isSmallScreenWidth(): boolean {
    return window.innerWidth < 768;
  }

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Reserva exitosa',
        titleColor: 'dark',
        image: 'assets/generic/checkmark.png',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  onModelSelected(v: VehicleCard): void {
    this.vehicleID = v.id;
    this.vehicleModel = v.vehicleModel;
    this.category = v.category;
    this.passengerCount = v.passengerCount;
    this.pricePerDay = v.pricePerDay;
    this.deposit = v.deposit;
    this.brand = v.brand;

    this.vehicleModelForm.get('vehicleModel')?.setValue(this.vehicleModel);
    this.stepper.next();
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 1) {
      this.setFilter();
    } else if (event.selectedIndex === 2) {
      this.finalPrice = this.reservationPriceCalculationService.calculatePrice(
        this.startDate,
        this.endDate,
        this.pricePerDay
      );
    }
  }

  loadLocations(): void {
    this.locationApiService.getAll().subscribe({
      next: (response: LocationsResponse) => (this.locations = response.data),
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  get hasLocations(): boolean {
    return this.locations.length > 0;
  }

  getUserRole(): void {
    this.authService.getAuthenticatedRole().subscribe({
      next: (response: { role: string }) => {
        this.userRole = response.role;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  get fontSizeClass(): string {
    return this.userRole === 'client' ? 'fs-3' : 'fs-4';
  }

  getImageServerUrl(): void {
    this.imageApiService.getImageServerUrl().subscribe({
      next: (response: { imageServerUrl: string }) => {
        this.imageServerUrl = `${response.imageServerUrl}/`;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  getStartDate(startDate: Date | string): Date {
    return typeof startDate !== 'string' ? startDate : new Date();
  }

  getEndDate(endDate: Date | string): Date {
    return typeof endDate !== 'string' ? endDate : new Date();
  }

  setFilter(): void {
    if (!this.vehicleFilterForm.invalid) {
      const formValues: ReservationFilter = this.vehicleFilterForm.value;

      const filter: ReservationFilter = {
        startDate: this.formatDateService.removeTimeZoneFromDate(
          this.getStartDate(formValues.startDate)
        ),
        endDate: this.formatDateService.removeTimeZoneFromDate(
          this.getEndDate(formValues.endDate)
        ),
        location: formValues.location,
      };
      this.fetchVehicles(filter as ReservationFilter);
    }
  }

  fetchVehicles(filter: ReservationFilter): void {
    this.vehicleApiService
      .findAvailableVehicles(filter as ReservationFilter)
      .subscribe({
        next: (response: VehiclesResponse) => {
          this.response = response.data.map(
            this.vehicleCardTransformerService.transformToVehicleCardFormat
          );
        },
        error: () => {
          this.snackBarService.show(
            'Error al obtener los vehículos disponibles'
          );
        },
      });
  }

  submitReservation(): void {
    const formValues: ReservationFilter = this.vehicleFilterForm.value;

    const today: Date = new Date();
    today.setHours(today.getHours() - 3);

    const data: ReservationInput = {
      reservationDate: this.formatDateService.removeTimeZoneFromDate(today),
      startDate: this.formatDateService.removeTimeZoneFromDate(
        this.getStartDate(formValues.startDate)
      ),
      plannedEndDate: this.formatDateService.removeTimeZoneFromDate(
        this.getEndDate(formValues.endDate)
      ),
      vehicle: this.vehicleID,
    };

    this.reservationApiService
      .createByUser(data as ReservationInput)
      .subscribe({
        next: () => {
          this.openDialog();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        },
      });
  }
}
