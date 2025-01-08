// Angular
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserAgeValidationService {
  userAgeValidation() {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = control.value;

      if (!birthDate) {
        return null;
      }

      const today = new Date();
      const minAgeDate = new Date(
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
