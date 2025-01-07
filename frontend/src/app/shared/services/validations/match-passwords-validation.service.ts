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
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let newPassword = formGroup.get(newPasswordField)?.value;
      let confirmPassword = formGroup.get(confirmPasswordField)?.value;

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
