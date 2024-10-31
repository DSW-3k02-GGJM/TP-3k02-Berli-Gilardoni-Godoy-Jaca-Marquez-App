import {Component, OnInit, signal} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpClientModule } from "@angular/common/http";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {SuccessfulModalComponent} from "../successful-modal/successful-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

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
          const modalRef = this.modalService.open(SuccessfulModalComponent, { backdrop: 'static', keyboard: false });
          modalRef.componentInstance.title = 'Inicio de sesión exitoso';
        },
        err => {
          if (err.status === 401) {
            this.errorMessage = 'El email o la contraseña son incorrectas';
            console.log(this.errorMessage);
          } else {
            this.errorMessage = 'Error en el servidor';
          }
        });
      }
    } 
}
