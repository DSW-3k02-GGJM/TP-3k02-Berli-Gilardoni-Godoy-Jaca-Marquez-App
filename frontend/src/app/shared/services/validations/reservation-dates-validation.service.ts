// Angular
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

// Services
import { FormatDateService } from '@shared/services/utils/format-date.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationDatesValidationService {
  constructor(private formatDateService: FormatDateService) {}

  reservationDatesValidation(
    startDateField: string,
    endDateField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const group: FormGroup = formGroup as FormGroup;
      const startDateValue: Date = group.get(startDateField)?.value;
      const endDateValue: Date = group.get(endDateField)?.value;
      const currentDate: string = this.formatDateService.formatDateToDash(
        new Date()
      );

      const startDate: string | null = startDateValue
        ? this.formatDateService.formatDateToDash(startDateValue)
        : null;
      const endDate: string | null = endDateValue
        ? this.formatDateService.formatDateToDash(endDateValue)
        : null;

      group.get(startDateField)?.setErrors(null);
      group.get(endDateField)?.setErrors(null);

      if (!startDate || !endDate) {
        group.get(startDateField)?.setErrors({
          dateInvalid: 'El rango de fechas es requerido.',
        });
        return null;
      }

      if (startDate && startDate < currentDate) {
        group.get(startDateField)?.setErrors({
          dateInvalid: 'La fecha de inicio debe ser mayor o igual a hoy.',
        });
      } else if (startDate && endDate && startDate === endDate) {
        group.get(endDateField)?.setErrors({
          dateInvalid: 'Las fechas de inicio y de fin no pueden ser iguales.',
        });
      } else if (startDate && endDate && startDate > endDate) {
        group.get(endDateField)?.setErrors({
          dateInvalid: 'La fecha de fin debe ser posterior a la de inicio.',
        });
      }

      return null;
    };
  }
}
