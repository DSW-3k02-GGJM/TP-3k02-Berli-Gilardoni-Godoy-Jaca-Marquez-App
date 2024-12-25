// Angular
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserAgeValidationService {
  validateUserAge(birthDateField: string) {
    return (formGroup: AbstractControl) => {
      const birthDate = formGroup.get(birthDateField)?.value;
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split('T')[0];
      if (new Date(birthDate) > new Date(minAgeDate)) {
        formGroup.get(birthDateField)?.setErrors({
          dateInvalid: 'Debes ser mayor de edad',
        });
      } else {
        formGroup.get(birthDateField)?.setErrors(null);
      }
      return null;
    };
  }
}
