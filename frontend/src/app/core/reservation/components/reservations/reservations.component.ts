// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// RxJS
import { Subscription } from 'rxjs';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { ReservationModifiedService } from '@core/reservation/services/reservation.modified.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ReservationsTableComponent } from '@core/reservation/components/reservations-table/reservations-table.component';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { ReservationsResponse } from '@core/reservation/interfaces/reservations-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-reservations',
  standalone: true,
  templateUrl: './reservations.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, ReservationsTableComponent],
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];

  private subscription?: Subscription;

  constructor(
    private readonly reservationApiService: ReservationApiService,
    private readonly reservationModifiedService: ReservationModifiedService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscription =
      this.reservationModifiedService.reservationModified.subscribe({
        next: () => this.loadData(),
      });

    if (!this.reservationModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onReservationDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.reservationApiService.getAllByAdmin().subscribe({
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

  newReservation(): void {
    this.router.navigate(['/staff/reservations/create']);
  }
}
