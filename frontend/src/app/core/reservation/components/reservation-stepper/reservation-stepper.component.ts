// Angular
import { CommonModule } from '@angular/common';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

// RxJS
import { forkJoin } from 'rxjs';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { LocationApiService } from '@core/location/services/location.api.service';
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { ImageApiService } from '@shared/services/api/image.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { ReservationDatesValidationService } from '@shared/services/validations/reservation-dates-validation.service';
import { VehicleCardTransformerService } from '@shared/services/formatters/vehicle-card-transformer.service';
import { ReservationPriceCalculationService } from '@shared/services/calculations/reservation-price-calculation.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { VehicleCardComponent } from '@core/vehicle/components/vehicle-card/vehicle-card.component';

// Interfaces
import { ForkJoinUserResponse } from '@core/reservation/interfaces/fork-join-response';
import { ReservationInput } from '@core/reservation/interfaces/reservation-input.interface';
import { ReservationFilter } from '@core/reservation/interfaces/reservation-filter.interface';
import { VehiclesResponse } from '@core/vehicle/interfaces/vehicles-response.interface';
import { VehicleCard } from '@core/vehicle/interfaces/vehicle-card.interface';
import { Location } from '@core/location/interfaces/location.interface';
import {
  ErrorDialogOptions,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

// External Libraries
import { addDays } from 'date-fns';

@Component({
  selector: 'app-reservation-stepper',
  standalone: true,
  templateUrl: './reservation-stepper.component.html',
  styleUrl: '../../../../shared/styles/generic-reservation-stepper.scss',
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

  initialPrice: number = 0;

  tomorrow: Date = addDays(new Date(), 1);
  oneWeekAfterTomorrow: Date = addDays(this.tomorrow, 7);

  vehicleFilterForm: FormGroup = new FormGroup(
    {
      startDate: new FormControl(this.tomorrow, [Validators.required]),
      endDate: new FormControl(this.oneWeekAfterTomorrow, [
        Validators.required,
      ]),
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
    private readonly reservationApiService: ReservationApiService,
    private readonly locationApiService: LocationApiService,
    private readonly vehicleApiService: VehicleApiService,
    private readonly imageApiService: ImageApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly reservationDatesValidationService: ReservationDatesValidationService,
    private readonly vehicleCardTransformerService: VehicleCardTransformerService,
    private readonly reservationPriceCalculationService: ReservationPriceCalculationService,
    private readonly formatDateService: FormatDateService
  ) {}

  ngOnInit(): void {
    this.loadRelatedData();
    this.initializeDateFields();
    this.subscribeToFormChanges();
  }

  private isSmallScreenWidth(): boolean {
    return window.innerWidth < 768;
  }

  private loadRelatedData(): void {
    forkJoin({
      imageServerUrl: this.imageApiService.getImageServerUrl(),
      locations: this.locationApiService.getAll(),
    }).subscribe({
      next: (response: ForkJoinUserResponse) => {
        this.imageServerUrl = response.imageServerUrl.imageServerUrl;
        this.locations = response.locations.data;
        this.sortRelatedData();
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private sortRelatedData(): void {
    this.locations = this.locations.sort((a: Location, b: Location) =>
      a.locationName.localeCompare(b.locationName)
    );
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
      this.calculateInitialPrice();
    }
  }

  private initializeDateFields(): void {
    const startDate: Date = this.vehicleFilterForm.get('startDate')?.value;
    const endDate: Date = this.vehicleFilterForm.get('endDate')?.value;
    this.startDate = startDate
      ? this.formatDateService.formatDateToSlash(startDate)
      : '';
    this.endDate = endDate
      ? this.formatDateService.formatDateToSlash(endDate)
      : '';
  }

  private subscribeToFormChanges(): void {
    this.subscribeToDateField('startDate', (formattedValue: string) => {
      this.startDate = formattedValue;
    });
    this.subscribeToDateField('endDate', (formattedValue: string) => {
      this.endDate = formattedValue;
    });
    this.subscribeToLocationField();
  }

  private subscribeToDateField(
    fieldName: string,
    callback: (formattedValue: string) => void
  ): void {
    this.vehicleFilterForm.get(fieldName)?.valueChanges.subscribe({
      next: (value: Date | null) => {
        const formattedValue: string = value
          ? this.formatDateService.formatDateToSlash(value)
          : '';
        callback(formattedValue as string);
      },
    });
  }

  private subscribeToLocationField(): void {
    this.vehicleFilterForm.get('location')?.valueChanges.subscribe({
      next: (value: number | null) => {
        const selectedLocation = this.locations.find(
          (location: Location) => location.id === value
        );
        this.location = selectedLocation ? selectedLocation.locationName : '';
      },
    });
  }

  get hasLocations(): boolean {
    return this.locations.length > 0;
  }

  private setFilter(): void {
    if (!this.vehicleFilterForm.invalid) {
      this.fetchVehicles(this.vehicleFilterForm.value as ReservationFilter);
    }
  }

  private fetchVehicles(filter: ReservationFilter): void {
    this.vehicleApiService
      .findAvailableVehicles(filter as ReservationFilter)
      .subscribe({
        next: (response: VehiclesResponse) => {
          this.response = response.data.map(
            this.vehicleCardTransformerService.transformToVehicleCardFormat
          );
          this.sortVehicleCards();
        },
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private sortVehicleCards(): void {
    this.response = this.response.sort((a: VehicleCard, b: VehicleCard) =>
      `${a.brand} ${a.vehicleModel}`.localeCompare(
        `${b.brand} ${b.vehicleModel}`
      )
    );
  }

  private calculateInitialPrice(): void {
    this.initialPrice =
      this.reservationPriceCalculationService.calculateInitialPrice(
        this.startDate,
        this.endDate,
        this.pricePerDay,
        this.deposit
      );
  }

  submitReservation(): void {
    const formValues: ReservationFilter = this.vehicleFilterForm.value;

    const data: ReservationInput = {
      reservationDate: this.formatDateService.formatDateToDash(new Date()),
      startDate: this.formatDateService.formatDateToDash(formValues.startDate),
      plannedEndDate: this.formatDateService.formatDateToDash(
        formValues.endDate
      ),
      vehicle: this.vehicleID,
    };

    this.reservationApiService
      .createByUser(data as ReservationInput)
      .subscribe({
        next: (response: Message) => this.handleSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private handleSuccess(response: Message): void {
    this.openDialogService.success({
      title: response.message,
      goTo: '/staff/reservations',
    } as SuccessDialogOptions);
  }

  private handleError(error: HttpErrorResponse): void {
    this.openErrorDialog(error);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }
}
