// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, WritableSignal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Services
import { AuthService } from '@security/services/auth.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { MatchPasswordsValidationService } from '@shared/services/validations/match-passwords-validation.service';

// Interfaces
import { PasswordResetData } from '@core/user/interfaces/password-reset-data.interface';
import {
  ErrorDialogOptions,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';
import { Message } from '@shared/interfaces/message.interface';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    PreventEnterDirective,
  ],
})
export class ResetPasswordComponent {
  hide: WritableSignal<boolean> = signal(true);

  pending: boolean = false;

  resetPasswordForm: FormGroup = new FormGroup(
    {
      newPassword: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    },
    {
      validators: this.matchPasswordsValidationService.matchPasswordsValidation(
        'newPassword',
        'confirmPassword'
      ),
    }
  );

  constructor(
    private readonly authService: AuthService,
    private readonly openDialogService: OpenDialogService,
    private readonly matchPasswordsValidationService: MatchPasswordsValidationService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (!this.resetPasswordForm.invalid) {
      this.pending = true;
      this.activatedRoute.params.subscribe({
        next: (params) => {
          this.authService
            .verifyPasswordResetToken(
              params['token'],
              this.resetPasswordForm.value as PasswordResetData
            )
            .subscribe({
              next: (response: Message) => this.handleSuccess(response),
              error: (error: HttpErrorResponse) => this.handleError(error),
            });
        },
      });
    }
  }

  private handleSuccess(response: Message): void {
    this.pending = false;
    this.openSuccessDialog(response);
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openSuccessDialog(response: Message): void {
    this.openDialogService.success({
      title: response.message,
      goTo: '/home',
    } as SuccessDialogOptions);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }
}
