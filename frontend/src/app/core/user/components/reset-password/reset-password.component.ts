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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@security/services/auth.service';
import { MatchPasswordsValidationService } from '@shared/services/validations/match-passwords-validation.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { PasswordResetData } from '@core/user/interfaces/password-reset-data.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: '../../../../shared/styles/genericForm.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    PreventEnterDirective,
  ],
})
export class ResetPasswordComponent {
  hide: WritableSignal<boolean> = signal(true);

  errorMessage: string = '';
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
    private readonly matchPasswordsValidationService: MatchPasswordsValidationService,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Contraseña restablecida correctamente',
        titleColor: 'dark',
        image: 'assets/checkmark.png',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  openErrorDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al restablecer la contraseña',
        titleColor: 'dark',
        image: 'assets/wrongmark.png',
        message:
          'El periodo de restablecimiento de la contraseña ha expirado o es inválido',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  onSubmit(): void {
    if (!this.resetPasswordForm.invalid) {
      this.pending = true;
      this.activatedRoute.params.subscribe({
        next: (params) => {
          const token: string = params['token'];
          this.authService
            .verifyPasswordResetToken(
              token,
              this.resetPasswordForm.value as PasswordResetData
            )
            .subscribe({
              next: () => {
                this.pending = false;
                this.openDialog();
              },
              error: (error: HttpErrorResponse) => {
                this.pending = false;
                if (error.status === 401) {
                  this.openErrorDialog();
                } else if (error.status !== 400) {
                  this.errorMessage = 'Error en el servidor';
                }
              },
            });
        },
      });
    }
  }
}
