// Angular
import { Injectable } from '@angular/core';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LicensePlateValidationService {
  licensePlateValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value.toUpperCase() : '';

      // 3 letters 3 numbers
      const pattern1 = /^[A-Za-z]{3}\d{3}$/;

      // 2 letters 3 numbers 2 letters
      const pattern2 = /^[A-Za-z]{2}\d{3}[A-Za-z]{2}$/;

      if (!value || pattern1.test(value) || pattern2.test(value)) {
        return null;
      }
      return { ARpattern: true };
    };
  }
}
