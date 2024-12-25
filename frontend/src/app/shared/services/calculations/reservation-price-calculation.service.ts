// Angular
import { Injectable } from '@angular/core';

// Services
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Utility Functions
import { differenceInDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ReservationPriceCalculationService {
  constructor(private formatDateService: FormatDateService) {}

  calculatePrice(
    startDateAsString: string,
    plannedEndDateAsString: string,
    pricePerDay: number
  ): number {
    const formattedStartDate = new Date(
      this.formatDateService.fromSlashToDash(startDateAsString)
    );

    const formattedPlannedEndDate = new Date(
      this.formatDateService.fromSlashToDash(plannedEndDateAsString)
    );

    const days = differenceInDays(formattedPlannedEndDate, formattedStartDate);

    return days * pricePerDay;
  }
}
