// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// RxJS
import { Observable } from 'rxjs';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { ReservationModifiedService } from '@core/reservation/services/reservation.modified.service';
import { ReservationFilterService } from '@shared/services/filters/reservation-filter.service';
import { ReservationPriceCalculationService } from '@shared/services/calculations/reservation-price-calculation.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { ReservationInput } from '@core/reservation/interfaces/reservation-input.interface';
import { User } from '@core/user/interfaces/user.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import {
  DialogData,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Pipes
import { ReservationFilterPipe } from '@core/reservation/pipes/reservation-filter.pipe';

@Component({
  selector: 'app-reservations-table',
  standalone: true,
  templateUrl: './reservations-table.component.html',
  styleUrls: [
    '../../../../shared/styles/generic-table.scss',
    './reservations-table.component.scss',
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatNativeDateModule,
    ReservationFilterPipe,
  ],
})
export class ReservationsTableComponent {
  @Input() reservations: Reservation[] = [];
  @Output() reservationDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  filterDate: string = '';

  filteredReservations: Reservation[] = [];

  constructor(
    private readonly reservationApiService: ReservationApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly reservationModifiedService: ReservationModifiedService,
    private readonly reservationFilterService: ReservationFilterService,
    private readonly reservationPriceCalculationService: ReservationPriceCalculationService,
    private readonly formatDateService: FormatDateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservations'] && !changes['reservations'].firstChange) {
      this.filterReservations();
    }
  }

  private openDialogWithAction(
    dialogData: DialogData,
    apiAction: () => Observable<Message>,
    successMessage: string,
    errorMessage: string,
    actionType: 'delete' | 'cancel' | 'checkin' | 'checkout'
  ): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.generic(dialogData as DialogData);
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          apiAction().subscribe({
            next: () => this.handleSuccess(actionType, successMessage),
            error: (error: HttpErrorResponse) =>
              this.handleError(actionType, error, errorMessage),
          });
        }
      },
    });
  }

  private handleSuccess(
    actionType: 'delete' | 'cancel' | 'checkin' | 'checkout',
    successMessage: string
  ): void {
    if (actionType === 'delete') {
      this.reservationDeleted.emit();
    } else {
      this.reservationModifiedService.notifyReservationModified();
    }
    this.snackBarService.show(successMessage);
  }

  private handleError(
    actionType: 'delete' | 'cancel' | 'checkin' | 'checkout',
    error: HttpErrorResponse,
    errorMessage: string
  ) {
    const takeServerMessage: boolean =
      actionType === 'delete' || error.status === 500;
    this.openDialogService.error({
      message: takeServerMessage ? error.error?.message : errorMessage,
      goTo: takeServerMessage && error.status === 500 ? '/home' : '',
    } as ErrorDialogOptions);
  }

  private openDeleteDialog(id: number): void {
    const dialogData: DialogData = {
      id,
      title: 'Eliminar reserva',
      titleColor: 'danger',
      image: 'assets/generic/delete.png',
      message: '¿Está seguro de que desea eliminar la reserva?',
      showBackButton: true,
      backButtonTitle: 'Volver',
      mainButtonTitle: 'Eliminar',
      mainButtonColor: 'bg-danger',
      haveRouterLink: false,
    };

    const apiAction: () => Observable<Message> = () =>
      this.reservationApiService.delete(id);
    const successMessage: string = 'La reserva ha sido eliminada correctamente';
    const errorMessage: string = 'Error al eliminar la reserva';

    this.openDialogWithAction(
      dialogData as DialogData,
      apiAction as () => Observable<Message>,
      successMessage as string,
      errorMessage as string,
      'delete'
    );
  }

  private openCancelDialog(id: number): void {
    const dialogData: DialogData = {
      id,
      title: 'Cancelar reserva',
      titleColor: 'danger',
      image: 'assets/generic/wrongmark.png',
      message: '¿Está seguro de que desea cancelar la reserva?',
      showBackButton: true,
      backButtonTitle: 'Volver',
      mainButtonTitle: 'Cancelar',
      mainButtonColor: 'bg-danger',
      haveRouterLink: false,
    };

    const apiAction: () => Observable<Message> = () =>
      this.reservationApiService.update(id, {
        cancellationDate: this.formatDateService.formatDateToDash(new Date()),
      } as ReservationInput);
    const successMessage: string = 'La reserva ha sido cancelada correctamente';
    const errorMessage: string = 'Error al cancelar la reserva';

    this.openDialogWithAction(
      dialogData as DialogData,
      apiAction as () => Observable<Message>,
      successMessage as string,
      errorMessage as string,
      'cancel'
    );
  }

  private openCheckInDialog(reservation: Reservation): void {
    const dialogData: DialogData = {
      title: 'Check-in Reserva',
      titleColor: 'dark',
      image: 'assets/check-in-out/check-in.png',
      message: '¿Está seguro de que desea realizar el check-in de la reserva?',
      showBackButton: true,
      backButtonTitle: 'Volver',
      mainButtonTitle: 'Confirmar',
      mainButtonColor: 'custom-blue',
      haveRouterLink: false,
    };

    const apiAction: () => Observable<Message> = () => {
      return this.reservationApiService.update(reservation.id, {
        initialKms: this.getTotalKms(reservation.vehicle),
      } as ReservationInput);
    };
    const successMessage: string =
      'Se ha realizado el check-in de la reserva correctamente';
    const errorMessage: string = 'Error al realizar el check-in de la reserva';

    this.openDialogWithAction(
      dialogData as DialogData,
      apiAction as () => Observable<Message>,
      successMessage as string,
      errorMessage as string,
      'checkin'
    );
  }

  private openCheckOutDialog(reservation: Reservation): void {
    const dialogData: DialogData = {
      title: 'Check-out Reserva',
      titleColor: 'dark',
      image: 'assets/check-in-out/check-out.png',
      message:
        'Por favor, ingrese el kilometraje actual del vehículo y confirme si debe realizarse la devolución del depósito al cliente',
      showBackButton: true,
      backButtonTitle: 'Volver',
      mainButtonTitle: 'Confirmar',
      haveRouterLink: false,
      showCheckOutFields: true,
      initialKms: this.getTotalKms(reservation.vehicle),
    };

    const realEndDate: string = this.formatDateService.formatDateToDash(
      new Date()
    );

    const apiAction: () => Observable<Message> = () => {
      return this.reservationApiService.checkOut(reservation.id, {
        realEndDate,
        finalKms: dialogData.finalKms,
        finalPrice: this.reservationPriceCalculationService.calculateFinalPrice(
          reservation as Reservation,
          realEndDate as string,
          (dialogData.returnDeposit ?? true) as boolean
        ),
      } as ReservationInput);
    };
    const successMessage: string =
      'Se ha realizado el check-out de la reserva exitosamente';
    const errorMessage: string = 'Error al realizar el check-out de la reserva';

    this.openDialogWithAction(
      dialogData as DialogData,
      apiAction as () => Observable<Message>,
      successMessage as string,
      errorMessage as string,
      'checkout'
    );
  }

  formatDate(date: string): string {
    return this.formatDateService.fromDashToSlash(date);
  }

  getLicensePlate(vehicle: Vehicle | number | undefined): string {
    return typeof vehicle === 'object' ? vehicle.licensePlate : '';
  }

  private getTotalKms(vehicle: Vehicle | number | undefined): number {
    return typeof vehicle === 'object' ? vehicle.totalKms : -1;
  }

  getDocumentType(user: User | number | undefined): string {
    return typeof user === 'object' ? user.documentType : '';
  }

  getDocumentID(user: User | number | undefined): string {
    return typeof user === 'object' ? user.documentID : '';
  }

  get filteredReservationsByDocumentID(): Reservation[] {
    if (this.filterRows.length < 3) return this.filteredReservations;
    return this.reservations.filter((reservation: Reservation) =>
      this.getDocumentID(reservation.user)
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  filterReservations(): void {
    let filteredReservations: Reservation[] = this.reservations;
    if (this.filterDate) {
      if (Number.parseInt(this.filterDate.substring(0, 4)) < 1900) {
        this.filteredReservations = filteredReservations;
        return;
      }
      if (this.filterRows.length >= 3) {
        filteredReservations = this.filteredReservationsByDocumentID;
      }
      filteredReservations = this.reservationFilterService.filterReservations(
        this.filterDate,
        filteredReservations
      );
    }
    this.filteredReservations = filteredReservations;
  }

  disableCheckIn(reservation: Reservation): boolean {
    const currentDate: string = this.formatDateService.formatDateToDash(
      new Date()
    );
    const startDate: string = reservation.startDate ?? '';
    const plannedEndDate: string = reservation.plannedEndDate ?? '';

    if (currentDate < startDate || currentDate > plannedEndDate) {
      return true;
    }
    return false;
  }

  checkInReservation(reservation: Reservation): void {
    this.openCheckInDialog(reservation as Reservation);
  }

  checkOutReservation(reservation: Reservation): void {
    this.openCheckOutDialog(reservation as Reservation);
  }

  disableCancellationAndDeletion(reservation: Reservation): boolean {
    const currentDate: string = this.formatDateService.formatDateToDash(
      new Date()
    );
    const startDate: string = reservation.startDate ?? '';

    if (currentDate >= startDate) {
      return true;
    }
    return false;
  }

  cancelReservation(reservation: Reservation): void {
    this.openCancelDialog(reservation.id);
  }

  deleteReservation(reservation: Reservation): void {
    this.openDeleteDialog(reservation.id);
  }
}
