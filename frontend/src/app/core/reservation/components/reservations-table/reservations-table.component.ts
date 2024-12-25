// Angular
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// RxJS
import { Observable } from 'rxjs';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { ReservationFilterService } from '@shared/services/filters/reservation-filter.service';
import { ReservationFinalPriceCalculationService } from '@shared/services/calculations/reservation-final-price-calculation.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';
import { ReservationModifiedService } from '@core/reservation/services/reservation.service';

// Components
import { ConfirmDeletionDialogComponent } from '@shared/components/confirm-deletion-dialog/confirm-deletion-dialog.component';

// Pipes
import { FilterPipe } from '@shared/pipes/filter/filter.pipe';

// Utility Functions
import { differenceInDays } from 'date-fns';
import { GenericErrorDialogComponent } from '@shared/components/generic-error-dialog/generic-error-dialog.component.js';

@Component({
  selector: 'app-reservations-table',
  standalone: true,
  templateUrl: './reservations-table.component.html',
  styleUrls: [
    './reservations-table.component.scss',
    '../../../../shared/styles/genericTable.scss',
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    FilterPipe,
    MatNativeDateModule,
    MatCardModule,
  ],
})
export class ReservationsTableComponent {
  @Input() reservations!: any[];
  @Input() errorMessage: string = '';
  @Output() reservationDeleted = new EventEmitter<number>();

  filterRows: string = '';

  filterDate: string = '';

  filteredReservations: any[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private reservationFilterService: ReservationFilterService,
    private reservationFinalPriceCalculationService: ReservationFinalPriceCalculationService,
    private formatDateService: FormatDateService,
    private reservationModifiedService: ReservationModifiedService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Comprueba si el valor de 'reservations' ha cambiado
    if (changes['reservations'] && !changes['reservations'].firstChange) {
      this.filterReservations();
    }
  }

  openDialogWithAction(
    dialogData: any,
    apiAction: () => Observable<any>,
    successMessage: string,
    errorMessage: string,
    actionType: 'delete' | 'cancel' | 'checkin' | 'checkout'
  ): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          apiAction().subscribe({
            next: () => {
              if (actionType === 'delete') {
                this.reservationDeleted.emit(dialogData.id);
              } else {
                this.reservationModifiedService.notifyReservationModified();
              }
              this.snackBarService.show(successMessage);
            },
            error: () => {
              if (actionType === 'delete') {
                this.openErrorDialog();
              } else {
                this.snackBarService.show(errorMessage);
              }
            },
          });
        }
      },
    });
  }

  openDeleteDialog(id: number): void {
    const dialogData = {
      id,
      title: 'Eliminar reserva',
      titleColor: 'danger',
      image: 'assets/delete.png',
      message: '¿Está seguro de que desea eliminar la reserva?',
      buttonColor: 'danger',
    };

    const apiAction = () => this.apiService.delete('reservations', id);
    const successMessage = 'La reserva ha sido eliminada exitosamente';
    const errorMessage = 'Error al eliminar la reserva';

    this.openDialogWithAction(
      dialogData,
      apiAction,
      successMessage,
      errorMessage,
      'delete'
    );
  }

  openCancelDialog(id: number): void {
    const dialogData = {
      id,
      title: 'Cancelar reserva',
      titleColor: 'danger',
      image: 'assets/wrongmark.png',
      message: '¿Está seguro de que desea cancelar la reserva?',
      buttonColor: 'danger',
    };

    const apiAction = () =>
      this.apiService.update('reservations', Number(id), {
        cancellationDate: this.formatDateService.removeTimeZoneFromDate(
          new Date()
        ),
      });
    const successMessage = 'La reserva ha sido cancelada exitosamente';
    const errorMessage = 'Error al cancelar la reserva';

    this.openDialogWithAction(
      dialogData,
      apiAction,
      successMessage,
      errorMessage,
      'cancel'
    );
  }

  openCheckInDialog(reservation: any): void {
    const dialogData = {
      title: 'Check-in Reserva',
      titleColor: 'black',
      image: 'assets/check-in-img.png',
      message: '¿Está seguro de que desea realizar el check-in de la reserva?',
      buttonColor: 'primary',
    };
    const apiAction = () => {
      return this.apiService.update('reservations', reservation.id, {
        initialKms: reservation.vehicle.totalKms,
      });
    };
    const successMessage =
      'Se ha realizado el check-in de la reserva exitosamente';
    const errorMessage = 'Error al realizar el check-in de la reserva';

    this.openDialogWithAction(
      dialogData,
      apiAction,
      successMessage,
      errorMessage,
      'checkin'
    );
  }

  openCheckOutDialog(reservation: any): void {
    const dialogData = {
      title: 'Check-out Reserva',
      titleColor: 'black',
      image: 'assets/check-out-img.png',
      message: '¿Está seguro de que desea realizar el check-out de la reserva?',
      buttonColor: 'primary',
    };

    const apiAction = () => {
      return this.apiService.update('reservations', reservation.id, {
        realEndDate: this.formatDateService.removeTimeZoneFromDate(new Date()),
        finalKms: reservation.vehicle.totalKms,
      });
    };
    const successMessage =
      'Se ha realizado el check-out de la reserva exitosamente';
    const errorMessage = 'Error al realizar el check-out de la reserva';

    this.openDialogWithAction(
      dialogData,
      apiAction,
      successMessage,
      errorMessage,
      'checkout'
    );
  }

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar la reserva',
        message:
          'La reserva no se puede eliminar porque tiene recordatorios asociados.',
        haveRouterLink: false,
      },
    });
  }

  get filteredReservationsByDocumentID() {
    return this.reservations.filter((reservation) =>
      reservation.user.documentID
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  formatDate(date: any) {
    return this.formatDateService.fromDashToSlash(date);
  }

  deleteReservation(reservation: any): void {
    this.openDeleteDialog(reservation.id);
  }

  cancelReservation(reservation: any) {
    this.openCancelDialog(reservation.id);
  }

  checkInReservation(reservation: any): void {
    this.openCheckInDialog(reservation);
  }

  checkOutReservation(reservation: any): void {
    this.openCheckOutDialog(reservation);
  }

  disableCancellation(reservation: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(reservation.startDate);
    startDate.setHours(startDate.getHours() + 3);

    if (today >= startDate) {
      return true;
    }
    return false;
  }

  disableCheckIn(reservation: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(reservation.startDate);
    startDate.setHours(startDate.getHours() + 3);

    const plannedEndDate = new Date(reservation.plannedEndDate);
    plannedEndDate.setHours(plannedEndDate.getHours() + 3);

    if (today < startDate || today > plannedEndDate) {
      return true;
    }
    return false;
  }

  filterReservations(): void {
    const filteredReservations =
      this.reservationFilterService.filterReservations(
        this.filterDate,
        this.reservations
      );

    this.filteredReservations = filteredReservations.map((reservation) => ({
      ...reservation,
      calculatedPrice:
        this.reservationFinalPriceCalculationService.calculatePrice(
          reservation
        ),
    }));
  }
}
