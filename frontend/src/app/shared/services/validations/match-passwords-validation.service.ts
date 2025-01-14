// Angular
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class MatchPasswordsValidationService {
  matchPasswordsValidation(
    newPasswordField: string,
    confirmPasswordField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let newPassword: string = formGroup.get(newPasswordField)?.value;
      let confirmPassword: string = formGroup.get(confirmPasswordField)?.value;

      if (newPassword && newPassword !== confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({
          mismatch: true,
        });
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
      return null;
    };
  }
}
