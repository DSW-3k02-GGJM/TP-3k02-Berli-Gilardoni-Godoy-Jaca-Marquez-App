// Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// RxJS
import { Subscription } from 'rxjs';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { ReservationModifiedService } from '@core/reservation/services/reservation.service';

// Components
import { ReservationsTableComponent } from '@core/reservation/components/reservations-table/reservations-table.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReservationsTableComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent {
  reservations: any[] = [];
  errorMessage: string = '';

  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private reservationModifiedService: ReservationModifiedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onReservationDeleted(reservation: any): void {
    this.reservations = this.reservations.filter(
      (res) => res.id !== reservation.id
    );
  }

  fillData() {
    this.subscription =
      this.reservationModifiedService.reservationModified.subscribe({
        next: () => this.loadData(),
      });

    if (!this.reservationModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('reservations').subscribe({
      next: (response) => (this.reservations = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newReservation() {
    this.router.navigate(['/staff/reservations/create']);
  }
}
