// Angular
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
  emailValidation(): ValidatorFn {
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (control: AbstractControl): ValidationErrors | null => {
      const email: string = control.value;

      if (!email) {
        return null;
      }

      return emailRegex.test(email) ? null : { invalidEmail: true };
    };
  }
}
