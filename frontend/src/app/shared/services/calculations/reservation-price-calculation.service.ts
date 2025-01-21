// Angular
import { Injectable } from '@angular/core';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';

// Services
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Utility Functions
import { differenceInDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ReservationPriceCalculationService {
  constructor(private formatDateService: FormatDateService) {}

  calculateInitialPrice(
    startDateAsString: string,
    plannedEndDateAsString: string,
    pricePerDay: number,
    deposit: number
  ): number {
    const formattedStartDate: Date = this.convertToDate(startDateAsString);
    const formattedPlannedEndDate: Date = this.convertToDate(
      plannedEndDateAsString
    );
    const days: number = this.calculateDaysBetweenDates(
      formattedStartDate,
      formattedPlannedEndDate
    );
    return (days * pricePerDay + deposit) as number;
  }

  calculateFinalPrice(
    reservation: Reservation,
    realEndDateAsString: string,
    returnDeposit: boolean
  ): number {
    const startDate: Date = new Date(reservation.startDate ?? '');
    const plannedEndDate: Date = new Date(reservation.plannedEndDate ?? '');
    const realEndDate: Date = new Date(realEndDateAsString);
    const pricePerDay: number = this.getVehicleValue(
      reservation.vehicle,
      'pricePerDay'
    );
    const deposit: number = this.getVehicleValue(
      reservation.vehicle,
      'depositValue'
    );

    // Determine which date is later
    // If the client returns the car earlier, they are charged based on the planned end date
    // If they return it after the planned end date, they are charged based on the real end date
    const actualEndDate: Date =
      plannedEndDate > realEndDate ? plannedEndDate : realEndDate;

    const days: number = this.calculateDaysBetweenDates(
      startDate,
      actualEndDate
    );

    // If returnDeposit is true, the deposit is not added to the total price; otherwise it is
    return days * pricePerDay + (returnDeposit ? 0 : deposit);
  }

  private convertToDate(dateAsString: string): Date {
    return new Date(this.formatDateService.fromSlashToDash(dateAsString));
  }

  private calculateDaysBetweenDates(startDate: Date, endDate: Date): number {
    return differenceInDays(endDate, startDate);
  }

  private getVehicleValue(
    vehicle: Vehicle | number | undefined,
    value: 'pricePerDay' | 'depositValue'
  ): number {
    return typeof vehicle === 'object' &&
      typeof vehicle.vehicleModel?.category === 'object'
      ? vehicle.vehicleModel?.category[value]
      : -1;
  }
}
