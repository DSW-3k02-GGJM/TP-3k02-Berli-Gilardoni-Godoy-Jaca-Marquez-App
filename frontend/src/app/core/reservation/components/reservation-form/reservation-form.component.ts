// Angular
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

// Services
import { AuthService } from '@shared/services/auth/auth.service.js';
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { ReservationDatesValidationService } from '@shared/services/validations/reservation-dates-validation.service';
import { VehicleCardTransformerService } from '@shared/services/formatters/vehicle-card-transformer.service';
import { ReservationPriceCalculationService } from '@shared/services/calculations/reservation-price-calculation.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { VehicleCardComponent } from '@core/vehicle/components/vehicle-card/vehicle-card.component';
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';

// Interfaces
import { VehicleCard } from '@shared/interfaces/vehicle-card.model';
import { Filter } from '@shared/interfaces/filter.model';
import { FullUser } from '@shared/interfaces/full-user.model';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
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
    MatNativeDateModule,
    MatCardModule,
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss',
})
export class ReservationFormComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth < 700;
  }
  @ViewChild('stepper') stepper!: MatStepper;

  isSmallScreen = window.innerWidth < 768;

  userRole: string = '';

  locations: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  response: any[] = [];

  startDate: string = '';
  plannedEndDate: string = '';
  location: string = '';

  documentType: string = '';
  documentID: string = '';

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

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private reservationDatesValidationService: ReservationDatesValidationService,
    private vehicleCardTransformerService: VehicleCardTransformerService,
    private reservationPriceCalculationService: ReservationPriceCalculationService,
    private formatDateService: FormatDateService
  ) {}

  userForm = new FormGroup({
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required]),
  });

  vehicleFilterForm: FormGroup = new FormGroup(
    {
      startDate: new FormControl('', [Validators.required]),
      plannedEndDate: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    },
    {
      validators:
        this.reservationDatesValidationService.reservationDatesValidation(
          'startDate',
          'plannedEndDate'
        ),
    }
  );

  vehicleModelForm = new FormGroup({
    vehicleModel: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getUserRole();
    this.loadUsers();
    this.loadLocations();
  }

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Reserva exitosa',
        haveRouterLink: true,
        goTo: '/staff/reservations',
      },
    });
  }

  onModelSelected(v: VehicleCard) {
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
      this.vehicleFilterForm.get('startDate')?.valueChanges.subscribe({
        next: (value) => {
          this.startDate = value
            ? formatDate(value, 'dd/MM/yyyy', 'en-US')
            : '';
        },
      });
      this.vehicleFilterForm.get('plannedEndDate')?.valueChanges.subscribe({
        next: (value) => {
          this.plannedEndDate = value
            ? formatDate(value, 'dd/MM/yyyy', 'en-US')
            : '';
        },
      });
      this.vehicleFilterForm.get('location')?.valueChanges.subscribe({
        next: (value) => {
          const selectedLocation = this.locations.find(
            (location) => location.id === value
          );
          this.location = selectedLocation ? selectedLocation.locationName : '';
        },
      });
    } else if (event.selectedIndex === 2) {
      this.setFilter();
    } else if (event.selectedIndex === 3) {
      this.finalPrice = this.reservationPriceCalculationService.calculatePrice(
        this.startDate,
        this.plannedEndDate,
        this.pricePerDay
      );
    }
  }

  loadUsers(): void {
    this.apiService.getAll('users').subscribe({
      next: (response) => (this.users = response.data),
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  loadLocations(): void {
    this.apiService.getAll('locations').subscribe({
      next: (response) => (this.locations = response.data),
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
      next: (response) => {
        this.userRole = response.role;
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  fetchVehicles(filter: Filter) {
    this.apiService.findAvailableVehiclesForReservation(filter).subscribe({
      next: (response) => {
        this.response = response.data.map(
          this.vehicleCardTransformerService.transformToVehicleCardFormat
        );
      },
      error: () => {
        this.snackBarService.show('Error al obtener los vehículos disponibles');
      },
    });
  }

  setFilter() {
    if (!this.vehicleFilterForm.invalid) {
      const formValues = this.vehicleFilterForm.value;

      const filter = {
        startDate: this.formatDateService.removeTimeZoneFromDate(
          formValues.startDate
        ),
        endDate: this.formatDateService.removeTimeZoneFromDate(
          formValues.plannedEndDate
        ),
        location: formValues.location,
      };
      this.fetchVehicles(filter);
    }
  }

  onDocumentTypeSelected(event: MatSelectChange): void {
    const selectedDocumentType = event.value;
    this.filteredUsers = this.users
      .filter(
        (user) =>
          user.documentType === selectedDocumentType && user.role === 'client'
      )
      .sort((a: FullUser, b: FullUser) =>
        a.documentID.localeCompare(b.documentID, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
    this.documentType = selectedDocumentType;
  }

  onDocumentIDSelected(event: MatSelectChange): void {
    const selectedUserId = event.value;
    const selectedUser = this.filteredUsers.find(
      (user) => user.id === selectedUserId
    );

    this.documentID = selectedUser.documentID;
  }

  submitReservation() {
    const formValues = this.vehicleFilterForm.value;

    const today = new Date();
    today.setHours(today.getHours() - 3);

    const resData = {
      reservationDate: this.formatDateService.removeTimeZoneFromDate(today),
      startDate: this.formatDateService.removeTimeZoneFromDate(
        formValues.startDate
      ),
      plannedEndDate: this.formatDateService.removeTimeZoneFromDate(
        formValues.plannedEndDate
      ),
      user: this.userForm.value.documentID,
      vehicle: this.vehicleID,
    };

    this.apiService.createAdminReservation(resData).subscribe({
      next: () => {
        this.openDialog();
      },
      error: (error) => {
        if (error.status !== 400) {
          this.errorMessage = 'Error en el servidor. Intente de nuevo.';
        }
      },
    });
  }
}
