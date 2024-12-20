import {Component, inject, OnInit, signal} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpClientModule } from "@angular/common/http";
import {Subscription} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {SuccessfulModalComponent} from "../successful-modal/successful-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { GenericSuccesDialogComponent } from '../../shared/generic-succes-dialog/generic-succes-dialog.component.js';
import { ValidationDialogComponent } from '../validation-dialog/validation-dialog.component';

@Component({
  selector: 'app-login',
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
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GenericSuccesDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Login exitoso',
      }
    });
  }

  openValidationDialog(): void {
    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const email = this.loginForm.value.email;
        if (email) {
          this.authService.sendEmailVerification(email).subscribe(
            res => {
              this.errorMessage = "Se ha enviado un email de verificación a tu correo";
            },
            err => {
              console.log(err);
            }
          );
        }
      }
    });
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  }, { updateOn: 'submit' });
  errorMessage: string | null = null

  onSubmit() {
    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.value)
      .subscribe(
        res => {
          this.errorMessage = null;
          this.openDialog();
        },
        err => {
          if (err.status === 401) {
            this.errorMessage = 'El email o la contraseña son incorrectas';
            console.log(this.errorMessage);
          } 
          else if (err.status === 403) {
            this.openValidationDialog();
          }
          else{
            this.errorMessage = 'Error en el servidor';
          }
        });
      }
    } 
}
