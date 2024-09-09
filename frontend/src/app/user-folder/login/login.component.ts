import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpClientModule } from "@angular/common/http";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {SuccessfulModalComponent} from "../successful-modal/successful-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
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

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  errorMessage: string | null = null

  onSubmit() {
    console.log(this.loginForm.invalid)
      console.log("es valido");
      this.authService.login(this.loginForm.value)
        .subscribe(
          res=> {
            console.log("es valido2");
            this.errorMessage = null;
            console.log(res);
            const modalRef = this.modalService.open(SuccessfulModalComponent, { centered: true , backdrop: 'static', keyboard: false });
            modalRef.componentInstance.title = 'Inicio de sesión exitoso';
          },
          err => {
            if (err.status === 401) {
              this.errorMessage = 'Credenciales incorrectas';
              console.log(this.errorMessage);
            } else {
              this.errorMessage = 'Error en el servidor';
            }
          });
      }
}
