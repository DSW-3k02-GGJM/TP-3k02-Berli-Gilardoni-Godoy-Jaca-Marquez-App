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
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { ReservationFilterService } from '@shared/services/filters/reservation-filter.service';
import { ReservationFinalPriceCalculationService } from '@shared/services/calculations/reservation-final-price-calculation.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { ConfirmDeletionDialogComponent } from '@shared/components/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'app-reservations-client-table',
  standalone: true,
  templateUrl: './reservations-client-table.component.html',
  styleUrls: [
    './reservations-client-table.component.scss',
    '../../../../shared/styles/genericTable.scss',
  ],
  imports: [CommonModule, FormsModule, MatInputModule, MatCardModule],
})
export class ReservationsClientTableComponent {
  @Input() reservations!: any[];
  @Input() errorMessage: string = '';
  @Output() reservationCancelled = new EventEmitter<number>();

  filterDate: string = '';

  filteredReservations: any[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private reservationFilterService: ReservationFilterService,
    private reservationFinalPriceCalculationService: ReservationFinalPriceCalculationService,
    private formatDateService: FormatDateService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Comprueba si el valor de 'reservations' ha cambiado
    if (changes['reservations'] && !changes['reservations'].firstChange) {
      this.filterReservations();
    }
  }

  openCancelDialog(res: any): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Cancelar reserva',
        titleColor: 'danger',
        image: 'assets/wrongmark.png',
        message: '¿Está seguro de que desea cancelar la reserva?',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService
            .update('reservations', Number(res.id), {
              cancellationDate: this.formatDateService.removeTimeZoneFromDate(
                new Date()
              ),
            })
            .subscribe({
              next: () => {
                this.reservationCancelled.emit();
                this.snackBarService.show(
                  'La reserva ha sido cancelada exitosamente'
                );
              },
              error: () => {
                this.snackBarService.show('Error al cancelar la reserva');
              },
            });
        }
      },
    });
  }

  formatDate(DateDB: string): string {
    let DateTable: string = '${day}/${month}/${year}';
    DateTable = DateTable.replace('${month}', DateDB.substring(5, 7));
    DateTable = DateTable.replace('${day}', DateDB.substring(8, 10));
    DateTable = DateTable.replace('${year}', DateDB.substring(0, 4));
    return DateTable;
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

  cancelReservation(reservation: any): void {
    this.openCancelDialog(reservation);
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

  navigateToReservation(): void {
    this.router.navigate(['/reservation']);
  }
}
