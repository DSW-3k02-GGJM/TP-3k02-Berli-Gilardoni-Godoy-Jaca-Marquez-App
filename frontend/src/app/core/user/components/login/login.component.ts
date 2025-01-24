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
import { RouterLink } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';

// Services
import { AuthService } from '@security/services/auth.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { LoginData } from '@core/user/interfaces/login-data.interface';
import {
  DialogData,
  ErrorDialogOptions,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    PreventEnterDirective,
  ],
})
export class LoginComponent {
  hide: WritableSignal<boolean> = signal(true);

  message: string = '';
  pending: boolean = false;

  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,
        this.emailValidationService.emailValidation(),
      ]),
      password: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly authService: AuthService,
    private readonly openDialogService: OpenDialogService,
    private readonly emailValidationService: EmailValidationService
  ) {}

  private openSuccessDialog(response: Message): void {
    this.openDialogService.success({
      title: response.message,
      goTo: '/home',
    } as SuccessDialogOptions);
  }

  private openErrorDialog(message: string): void {
    this.openDialogService.error({
      message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  private openValidationDialog(message: string): void {
    const email: string = this.loginForm.value.email;
    this.sendEmailVerification(email);
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.generic({
        title: message,
        titleColor: 'dark',
        image: 'assets/generic/wrongmark.png',
        message: `Por favor, revise su email y verifique su cuenta para poder ingresar.`,
        showBackButton: true,
        backButtonTitle: 'Aceptar',
        mainButtonTitle: 'Reenviar Email',
        mainButtonColor: 'custom-blue',
        haveRouterLink: false,
      } as DialogData);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.sendEmailVerification(email);
        }
      },
    });
  }

  private sendEmailVerification(email: string): void {
    this.authService.sendEmailVerification(email).subscribe({
      next: (response: Message) => (this.message = response.message),
      error: (error: HttpErrorResponse) =>
        (this.message = error.error?.message),
    });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (!this.loginForm.invalid) {
      this.pending = true;
      this.authService.login(this.loginForm.value as LoginData).subscribe({
        next: (response: Message) => this.handleSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private handleSuccess(response: Message): void {
    this.pending = false;
    this.openSuccessDialog(response);
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;

    const errorMessage: string = error.error?.message;

    if (error.status === 403) {
      this.openValidationDialog(errorMessage);
    } else if (error.status === 500) {
      this.openErrorDialog(errorMessage);
    } else {
      this.message = errorMessage;
    }
  }
}
