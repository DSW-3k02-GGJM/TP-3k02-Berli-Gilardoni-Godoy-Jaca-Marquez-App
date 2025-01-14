// Angular
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserAgeValidationService {
  userAgeValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate: string = control.value;

      if (!birthDate) {
        return null;
      }

      const today: Date = new Date();
      const minAgeDate: string = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split('T')[0];

      if (new Date(birthDate).getFullYear() < 1900) {
        return { dateInvalid: 'El año debe ser posterior a 1900.' };
      }

      if (birthDate > minAgeDate) {
        return { dateInvalid: 'Debe ser mayor de edad.' };
      }

      return null;
    };
  }
}
