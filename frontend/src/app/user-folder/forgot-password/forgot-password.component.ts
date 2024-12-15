import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth.service.js';
import { MatDialog } from '@angular/material/dialog';
import { GenericSuccesDialogComponent } from '../../shared/generic-succes-dialog/generic-succes-dialog.component.js';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../styles/genericForm.scss', './forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GenericSuccesDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Solicitud exitosa',
        message: 'Por favor, revise su correo para recuperar su contraseña.',
        haveRouterLink: true,
        goTo: '/home'
      }
    });
  }
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    
  ) { }

  forgotPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  }, { updateOn: 'submit' });
  errorMessage: string | null = null
  pending = false;

  onSubmit() {
    if (!this.forgotPassword.invalid) {
      this.pending = true;
      const email = this.forgotPassword.value.email;
      if (email){
        this.authService.sendPasswordReset(email)
        .subscribe(
          res => {
            this.pending = false;
            this.errorMessage = null;
            this.openDialog();
          },
          err => {
            this.pending = false;
            if (err.status === 404) {
              this.errorMessage = 'El email no pertenece a una cuenta registrada';
            } 
            else if (err.status !== 400) {
              this.errorMessage = 'Error en el servidor';
            }
          }
        );
      }
    }
  } 
}
