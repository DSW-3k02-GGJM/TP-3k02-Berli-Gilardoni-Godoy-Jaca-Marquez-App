// Angular
import { Injectable } from '@angular/core';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';

// Utility Functions
import { differenceInDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ReservationFinalPriceCalculationService {
  calculatePrice(reservation: Reservation): string {
    const startDate: Date = new Date(reservation.startDate);
    const plannedEndDate: Date = new Date(reservation.plannedEndDate);
    const realEndDate: Date = new Date(
      this.getRealEndDate(reservation.realEndDate)
    );
    const pricePerDay: number = this.getPricePerDay(reservation.vehicle);

    // Determine which date is later
    // If the client returns the car earlier, they are charged based on the planned end date
    // If they return it after the planned end date, they are charged based on the real end date
    const actualEndDate: Date =
      plannedEndDate > realEndDate ? plannedEndDate : realEndDate;

    const days: number = differenceInDays(actualEndDate, startDate);
    return `${days * pricePerDay}`;
  }

  private getRealEndDate(realEndDate: string | undefined): string {
    return typeof realEndDate === 'string' ? realEndDate : '';
  }

  private getPricePerDay(vehicle: Vehicle | number): number {
    return typeof vehicle === 'object'
      ? typeof vehicle.vehicleModel?.category === 'object'
        ? vehicle.vehicleModel?.category.pricePerDay
        : -1
      : -1;
  }
}
