// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// Services
import { ReservationApiService } from '@core/reservation/services/reservation.api.service';

// Components
import { ReservationsClientTableComponent } from '@core/reservation/components/reservations-client-table/reservations-client-table.component';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { ReservationsResponse } from '@core/reservation/interfaces/reservations-response.interface';

@Component({
  selector: 'app-reservations-client',
  standalone: true,
  templateUrl: './reservations-client.component.html',
  styleUrl: './reservations-client.component.scss',
  imports: [CommonModule, ReservationsClientTableComponent],
})
export class ReservationsClientComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';

  constructor(private readonly reservationApiService: ReservationApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  onReservationCancelled(): void {
    this.loadData();
  }

  loadData(): void {
    this.reservationApiService.getAllByUser().subscribe({
      next: (response: ReservationsResponse) =>
        (this.reservations = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }
}
