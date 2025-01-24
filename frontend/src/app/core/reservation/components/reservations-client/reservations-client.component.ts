// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ReservationsClientTableComponent } from '@core/reservation/components/reservations-client-table/reservations-client-table.component';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { ReservationsResponse } from '@core/reservation/interfaces/reservations-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-reservations-client',
  standalone: true,
  templateUrl: './reservations-client.component.html',
  imports: [CommonModule, ReservationsClientTableComponent],
})
export class ReservationsClientComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(
    private readonly reservationApiService: ReservationApiService,
    private readonly openDialogService: OpenDialogService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onReservationCancelled(): void {
    this.loadData();
  }

  private loadData(): void {
    this.reservationApiService.getAllByUser().subscribe({
      next: (response: ReservationsResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: ReservationsResponse): void {
    this.reservations = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }
}
