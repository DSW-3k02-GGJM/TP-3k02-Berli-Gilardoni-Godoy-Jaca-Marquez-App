// Angular
import { Injectable } from '@angular/core';

// Utility Functions
import { differenceInDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ReservationFinalPriceCalculationService {
  calculatePrice(reservation: any): string {
    const startDate = new Date(reservation.startDate);
    const plannedEndDate = new Date(reservation.plannedEndDate);
    const realEndDate = new Date(reservation.realEndDate);
    const pricePerDay = reservation.vehicle.vehicleModel.category.pricePerDay;

    // Determine which date is later
    // If the client returns the car earlier, they are charged based on the planned end date
    // If they return it after the planned end date, they are charged based on the real end date
    const actualEndDate =
      plannedEndDate > realEndDate ? plannedEndDate : realEndDate;

    const days = differenceInDays(actualEndDate, startDate);
    return `${days * pricePerDay}`;
  }
}
