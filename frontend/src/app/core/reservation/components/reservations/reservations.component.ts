// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// RxJS
import { Subscription } from 'rxjs';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';
import { ReservationModifiedService } from '@core/reservation/services/reservation.modified.service';

// Components
import { ReservationsTableComponent } from '@core/reservation/components/reservations-table/reservations-table.component';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { ReservationsResponse } from '@core/reservation/interfaces/reservations-response.interface';

@Component({
  selector: 'app-reservations',
  standalone: true,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
  imports: [CommonModule, ReservationsTableComponent],
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';

  private subscription?: Subscription;

  constructor(
    private readonly reservationApiService: ReservationApiService,
    private readonly reservationModifiedService: ReservationModifiedService,
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

  loadData(): void {
    this.reservationApiService.getAllByAdmin().subscribe({
      next: (response: ReservationsResponse) =>
        (this.reservations = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newReservation(): void {
    this.router.navigate(['/staff/reservations/create']);
  }
}
