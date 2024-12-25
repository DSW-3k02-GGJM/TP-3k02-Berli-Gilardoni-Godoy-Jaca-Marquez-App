// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { ReservationsClientTableComponent } from '../reservations-client-table/reservations-client-table.component';

@Component({
  selector: 'app-res-client',
  standalone: true,
  imports: [CommonModule, ReservationsClientTableComponent],
  templateUrl: './reservations-client.component.html',
  styleUrl: './reservations-client.component.scss',
})
export class ReservationsClientComponent implements OnInit {
  reservations: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fillData();
  }

  onReservationCancelled(): void {
    this.fillData();
  }

  fillData() {
    this.apiService.getReservationsByUser().subscribe({
      next: (response) => (this.reservations = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }
}
