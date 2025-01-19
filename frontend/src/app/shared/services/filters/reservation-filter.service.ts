// Angular
import { Injectable } from '@angular/core';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationFilterService {
  filterReservations(
    filterDate: string,
    reservations: Reservation[]
  ): Reservation[] {
    const date: Date = new Date(filterDate);
    if (!filterDate || isNaN(date.getTime())) {
      return reservations as Reservation[];
    }
    return reservations.filter((reservation: Reservation) => {
      const startDate: Date = new Date(reservation.startDate ?? '');
      const plannedEndDate: Date = new Date(reservation.plannedEndDate ?? '');
      return (date >= startDate && date <= plannedEndDate) as boolean;
    }) as Reservation[];
  }
}
