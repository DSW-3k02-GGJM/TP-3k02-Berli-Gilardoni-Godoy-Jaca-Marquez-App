import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ReservationDatesValidationService {
  validateReservationDates(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl) => {
      let startDate = formGroup.get(startDateField)?.value;
      let endDate = formGroup.get(endDateField)?.value;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate && new Date(startDate) < today) {
        formGroup.get(startDateField)?.setErrors({
          dateInvalid: {
            message: 'La fecha de inicio debe ser mayor o igual a hoy',
          },
        });
      } else if (
        startDate &&
        endDate &&
        startDate.toISOString() > endDate.toISOString()
      ) {
        formGroup.get(endDateField)?.setErrors({
          dateInvalid: {
            message: 'La fecha de fin debe ser posterior al inicio',
          },
        });
      } else if (
        startDate &&
        endDate &&
        startDate.toISOString() === endDate.toISOString()
      ) {
        formGroup.get(endDateField)?.setErrors({
          dateInvalid: {
            message: 'Las fechas de inicio y de fin no pueden ser iguales',
          },
        });
      } else if (!endDate) {
        formGroup.get(endDateField)?.setErrors({
          dateInvalid: {
            message: 'La fecha de fin es requerida',
          },
        });
      } else {
        formGroup.get(startDateField)?.setErrors(null);
        formGroup.get(endDateField)?.setErrors(null);
      }
      return null;
    };
  }
}
