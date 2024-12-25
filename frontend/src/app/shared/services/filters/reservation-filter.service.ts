// Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationFilterService {
  filterReservations(filterDate: string, reservations: any[]): any[] {
    const date = new Date(filterDate);
    if (!filterDate || isNaN(date.getTime())) {
      return reservations;
    }

    return reservations.filter((reservation) => {
      const startDate = new Date(reservation.startDate);
      const plannedEndDate = new Date(reservation.plannedEndDate);
      return date >= startDate && date <= plannedEndDate;
    });
  }
}
