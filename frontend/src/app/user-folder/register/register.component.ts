import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpClientModule } from "@angular/common/http";
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
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email], [this.authService.uniqueEmailValidator()]),
    password: new FormControl('', [Validators.required]),
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")], [this.authService.uniqueDocumentIDValidator()]),
    userName: new FormControl('', [Validators.required]),
    userSurname: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required, this.authService.maxDateValidator]), //TODO: ver si parsea bien la fecha
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]), //TODO: añadir validador de telefono
    nationality: new FormControl('', [Validators.required]),

  }, { updateOn: 'submit' });

  onSubmit() {
    console.log(this.registerForm.value);
    if (!this.registerForm.invalid) {
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          const modalRef = this.modalService.open(SuccessfulModalComponent, { centered: true , backdrop: 'static', keyboard: false , size: 'sm' });
          modalRef.componentInstance.title = 'Registro exitoso';
          console.log(response);
        });
    }   
  }
}
