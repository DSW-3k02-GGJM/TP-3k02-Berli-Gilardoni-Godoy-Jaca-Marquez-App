// Angular
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@shared/services/auth/auth.service';

// Components
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
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
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../../../../shared/styles/genericForm.scss',
  ],
})
export class ForgotPasswordComponent {
  errorMessage: string | null = null;
  pending: boolean = false;

  forgotPassword = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
    },
    { updateOn: 'submit' }
  );

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Solicitud exitosa',
        message: 'Por favor, revise su correo para recuperar su contraseña.',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  onSubmit() {
    if (!this.forgotPassword.invalid) {
      this.pending = true;
      const email = this.forgotPassword.value.email;
      if (email) {
        this.authService.sendPasswordReset(email).subscribe({
          next: () => {
            this.pending = false;
            this.errorMessage = null;
            this.openDialog();
          },
          error: (error) => {
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
