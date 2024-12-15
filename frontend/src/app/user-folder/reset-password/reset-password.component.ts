import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service.js';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { GenericSuccesDialogComponent } from '../../shared/generic-succes-dialog/generic-succes-dialog.component.js';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: '../../styles/genericForm.scss'
})
export class ResetPasswordComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GenericSuccesDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Contraseña cambiada correctamente',
        haveRouterLink: true,
        goTo: '/home'
      }
    });
  }

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al cambiar la contraseña',
        message: 'El cambio de contraseña ha expirado o es inválido',
        haveRouterLink: true,
        goTo: '/home'
      }
    });
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.matchPasswordValidator(), updateOn: 'submit' });
  errorMessage: string | null = null
  pending = false;

  matchPasswordValidator() {
    return (formGroup: AbstractControl) => {
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      console.log(newPassword !== confirmPassword);
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
  
        formGroup.get('confirmPassword')?.setErrors({
          mismatch: true,
        });
        console.log(formGroup);
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
      return null;
    };
  }

  constructor(
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
  ) {}

  onSubmit() {
    if (!this.resetPasswordForm.invalid) {
      this.pending = true;
      this.route.params.subscribe(params => {
        const token = params['token'];
        this.authService.verifyPasswordResetToken(token,this.resetPasswordForm.value)
        .subscribe({
          next: response => {
            this.pending = false;
            this.errorMessage = null;
            this.openDialog();
          },
          error: error => {
            this.pending = false;
            if (error.status === 401) {
              this.openErrorDialog();
            } 
            else if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor';
            }
          }
        }); 
          
      });
    }
  }

}
