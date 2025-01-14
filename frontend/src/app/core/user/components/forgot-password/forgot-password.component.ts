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
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@security/services/auth.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../../../../shared/styles/genericForm.scss',
  ],
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
    private readonly emailValidationService: EmailValidationService,
    private readonly dialog: MatDialog
  ) {}

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Solicitud exitosa',
        titleColor: 'dark',
        image: 'assets/checkmark.png',
        message: 'Por favor, revise su correo para recuperar su contraseña.',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  onSubmit(): void {
    if (!this.forgotPassword.invalid) {
      this.pending = true;
      const email: string = this.forgotPassword.value.email;
      if (email) {
        this.authService.sendPasswordReset(email).subscribe({
          next: () => {
            this.pending = false;
            this.openDialog();
          },
          error: (error: HttpErrorResponse) => {
            this.pending = false;
            if (error.status === 404) {
              this.errorMessage =
                'El email no pertenece a una cuenta registrada';
            } else if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor';
            }
          },
        });
      }
    }
  }
}
