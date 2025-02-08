// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

// Services
import { AuthService } from '@security/services/auth.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Interfaces
import {
  ErrorDialogOptions,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    PreventEnterDirective,
  ],
})
export class ForgotPasswordComponent {
  errorMessage: string = '';
  pending: boolean = false;

  forgotPassword: FormGroup = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,
        this.emailValidationService.emailValidation(),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly authService: AuthService,
    private readonly openDialogService: OpenDialogService,
    private readonly emailValidationService: EmailValidationService
  ) {}

  onSubmit(): void {
    if (!this.forgotPassword.invalid) {
      this.pending = true;
      const email: string = this.forgotPassword.value.email;
      if (email) {
        this.authService.sendPasswordReset(email).subscribe({
          next: (response: Message) => this.handleSuccess(response),
          error: (error: HttpErrorResponse) => this.handleError(error),
        });
      }
    }
  }

  private handleSuccess(response: Message): void {
    this.pending = false;
    this.openDialogService.success({
      title: response.message,
      message: 'Por favor, revise su correo para recuperar su contraseña.',
      goTo: '/home',
    } as SuccessDialogOptions);
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    const errorMessage = error.error?.message;
    if (error.status === 500) {
      this.showErrorDialog(errorMessage, '/home');
    } else {
      this.errorMessage = errorMessage;
    }
  }

  private showErrorDialog(message: string, goTo: string): void {
    this.openDialogService.error({
      message,
      goTo,
    } as ErrorDialogOptions);
  }
}
