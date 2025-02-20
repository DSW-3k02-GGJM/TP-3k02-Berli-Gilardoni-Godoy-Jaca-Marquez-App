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
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { ReservationFilterService } from '@shared/services/filters/reservation-filter.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { ReservationInput } from '@core/reservation/interfaces/reservation-input.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import {
  DialogData,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

@Component({
  selector: 'app-reservations-client-table',
  standalone: true,
  templateUrl: './reservations-client-table.component.html',
  styleUrls: [
    '../../../../shared/styles/generic-table.scss',
    './reservations-client-table.component.scss',
  ],
  imports: [CommonModule, FormsModule, MatInputModule, MatCardModule],
})
export class ReservationsClientTableComponent {
  @Input() reservations: Reservation[] = [];
  @Output() reservationCancelled: EventEmitter<void> = new EventEmitter<void>();

  filterDate: string = '';

  filteredReservations: Reservation[] = [];

  constructor(
    private readonly reservationApiService: ReservationApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly reservationFilterService: ReservationFilterService,
    private readonly formatDateService: FormatDateService,
    private readonly router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservations'] && !changes['reservations'].firstChange) {
      this.filterReservations();
    }
  }

  private openCancelDialog(id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.generic({
        title: 'Cancelar reserva',
        titleColor: 'danger',
        image: 'assets/generic/wrongmark.png',
        message: '¿Está seguro de que desea cancelar la reserva?',
        showBackButton: true,
        backButtonTitle: 'Volver',
        mainButtonTitle: 'Cancelar',
        mainButtonColor: 'bg-danger',
        haveRouterLink: false,
      });
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.reservationApiService
            .update(id, {
              cancellationDate: this.formatDateService.formatDateToDash(
                new Date()
              ),
            } as ReservationInput)
            .subscribe({
              next: () => this.handleSuccess(),
              error: (error: HttpErrorResponse) => this.handleError(error),
            });
        }
      },
    });
  }

  private handleSuccess(): void {
    this.reservationCancelled.emit();
    this.snackBarService.show('La reserva ha sido cancelada correctamente');
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  formatDate(date: string): string {
    return this.formatDateService.fromDashToSlash(date);
  }

  getBrandName(vehicle: Vehicle | number | undefined): string {
    return typeof vehicle === 'object'
      ? vehicle.vehicleModel?.brand?.brandName ?? ''
      : '';
  }

  getVehicleModelName(vehicle: Vehicle | number | undefined): string {
    return typeof vehicle === 'object'
      ? vehicle.vehicleModel?.vehicleModelName ?? ''
      : '';
  }

  filterReservations(): void {
    let filteredReservations: Reservation[] = this.reservations;
    if (this.filterDate) {
      if (Number.parseInt(this.filterDate.substring(0, 4)) < 1900) {
        this.filteredReservations = filteredReservations;
        return;
      }
      filteredReservations = this.reservationFilterService.filterReservations(
        this.filterDate,
        filteredReservations
      );
    }
    this.filteredReservations = filteredReservations;
  }

  disableCancellation(reservation: Reservation): boolean {
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

  navigateToReservation(): void {
    this.router.navigate(['/reservation']);
  }
}
