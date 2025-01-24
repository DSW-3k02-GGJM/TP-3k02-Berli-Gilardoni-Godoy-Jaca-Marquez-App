// Angular
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Services
import { FormatDateService } from '../utils/format-date.service';

// External Libraries
import { subYears } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class UserAgeValidationService {
  constructor(private formatDateService: FormatDateService) {}

  userAgeValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate: string = control.value;

      if (!birthDate) {
        return null;
      }

      const maxBirthDate: string = this.formatDateService.formatDateToDash(
        subYears(new Date(), 18)
      );

      if (Number(birthDate.substring(0, 4)) < 1900) {
        return { dateInvalid: 'El año debe ser posterior a 1900.' };
      }

      if (birthDate > maxBirthDate) {
        return { dateInvalid: 'Debe ser mayor de edad.' };
      }

      return null;
    };
  }
}
