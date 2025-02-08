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
    if (!filterDate || !this.isValidDate(filterDate)) {
      return reservations as Reservation[];
    }
    return reservations.filter((reservation: Reservation) => {
      const startDate: string = reservation.startDate ?? '';
      const plannedEndDate: string = reservation.plannedEndDate ?? '';
      return filterDate >= startDate && filterDate <= plannedEndDate;
    }) as Reservation[];
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }
}
