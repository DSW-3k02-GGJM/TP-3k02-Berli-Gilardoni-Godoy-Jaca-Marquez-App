// Angular
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ReservationDatesValidationService {
  reservationDatesValidation(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const group = formGroup as FormGroup;
      const startDate = group.get(startDateField)?.value;
      const endDate = group.get(endDateField)?.value;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      group.get(startDateField)?.setErrors(null);
      group.get(endDateField)?.setErrors(null);

      if (!startDate || !endDate) {
        group.get(startDateField)?.setErrors({
          dateInvalid: 'El rango de fechas es requerido.',
        });
        return null;
      }

      if (startDate && new Date(startDate) < today) {
        group.get(startDateField)?.setErrors({
          dateInvalid: 'La fecha de inicio debe ser mayor o igual a hoy.',
        });
      } else if (
        startDate &&
        endDate &&
        startDate.toISOString() === endDate.toISOString()
      ) {
        group.get(endDateField)?.setErrors({
          dateInvalid: 'Las fechas de inicio y de fin no pueden ser iguales.',
        });
      } else if (
        startDate &&
        endDate &&
        startDate.toISOString() > endDate.toISOString()
      ) {
        group.get(endDateField)?.setErrors({
          dateInvalid: 'La fecha de fin debe ser posterior al inicio.',
        });
      }

      return null;
    };
  }
}
