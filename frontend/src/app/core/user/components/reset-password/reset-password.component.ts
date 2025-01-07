// Angular
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@shared/services/auth/auth.service';
import { MatchPasswordsValidationService } from '@shared/services/validations/match-passwords-validation.service.js';

// Components
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';
import { GenericErrorDialogComponent } from '@shared/components/generic-error-dialog/generic-error-dialog.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
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
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: '../../../../shared/styles/genericForm.scss',
})
export class ResetPasswordComponent {
  hide: WritableSignal<boolean> = signal(true);

  errorMessage: string | null = null;
  pending: boolean = false;

  resetPasswordForm = new FormGroup(
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
    private authService: AuthService,
    private matchPasswordsValidationService: MatchPasswordsValidationService,
    private dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Contraseña restablecida correctamente',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al restablecer la contraseña',
        message:
          'El periodo de restablecimiento de la contraseña ha expirado o es inválido',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  onSubmit() {
    if (!this.resetPasswordForm.invalid) {
      this.pending = true;
      this.route.params.subscribe({
        next: (params) => {
          const token = params['token'];
          this.authService
            .verifyPasswordResetToken(token, this.resetPasswordForm.value)
            .subscribe({
              next: () => {
                this.pending = false;
                this.errorMessage = null;
                this.openDialog();
              },
              error: (error) => {
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
