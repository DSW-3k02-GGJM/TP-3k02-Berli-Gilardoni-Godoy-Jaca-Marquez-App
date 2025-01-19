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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// Services
import { AuthService } from '@security/services/auth.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { LoginData } from '@core/user/interfaces/login-data.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

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
    private readonly emailValidationService: EmailValidationService,
    private readonly dialog: MatDialog
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
        title: 'Inicio de sesión exitoso',
        titleColor: 'dark',
        image: 'assets/generic/checkmark.png',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  openValidationDialog(): void {
    const email: string = this.loginForm.value.email;
    this.sendEmailVerification(email);
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.dialog.open(GenericDialogComponent, {
        width: '350px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: {
          title: 'Cuenta no verificada',
          titleColor: 'dark',
          image: 'assets/generic/wrongmark.png',
          message: `Por favor, revise su email y verifique su cuenta para poder ingresar.`,
          showBackButton: true,
          backButtonTitle: 'Aceptar',
          mainButtonTitle: 'Reenviar Email',
          mainButtonColor: 'custom-blue',
          haveRouterLink: false,
        },
      } as GenericDialog);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.sendEmailVerification(email);
        }
      },
    });
  }

  sendEmailVerification(email: string): void {
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

  onSubmit(): void {
    if (!this.loginForm.invalid) {
      this.pending = true;
      this.authService.login(this.loginForm.value as LoginData).subscribe({
        next: () => {
          this.pending = false;
          this.openDialog();
        },
        error: (error: HttpErrorResponse) => {
          this.pending = false;
          if (error.status === 401) {
            this.message = 'El email y/o la contraseña son incorrectos';
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
