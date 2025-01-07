// Angular
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@shared/services/auth/auth.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service.js';

// Components
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';
import { ValidationDialogComponent } from '../validation-dialog/validation-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide: WritableSignal<boolean> = signal(true);

  message: string | null = null;
  pending: boolean = false;

  loginForm = new FormGroup(
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
    private authService: AuthService,
    private emailValidationService: EmailValidationService,
    private dialog: MatDialog
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
        title: 'Inicio de sesión exitoso',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  openValidationDialog(): void {
    const email = this.loginForm.value.email;
    if (email) {
      this.sendVerificationEmail(email);
    }

    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result && email) {
          this.sendVerificationEmail(email);
        }
      },
    });
  }

  sendVerificationEmail(email: string): void {
    this.authService.sendEmailVerification(email).subscribe({
      next: () => {
        this.message = 'Se ha enviado un email de verificación a tu correo.';
      },
      error: () => {
        this.message =
          'No se pudo enviar el email de verificación. Intente nuevamente.';
      },
    });
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      this.pending = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.pending = false;
          this.message = null;
          this.openDialog();
        },
        error: (error) => {
          this.pending = false;
          if (error.status === 401) {
            this.message = 'El email o la contraseña son incorrectas';
          } else if (error.status === 403) {
            this.openValidationDialog();
          } else {
            this.message = 'Error en el servidor';
          }
        },
      });
    }
  }
}
