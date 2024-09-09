import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpClientModule } from "@angular/common/http";
import {SuccessfulModalComponent} from "../successful-modal/successful-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
      MatInputModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required], [this.authService.uniqueEmailValidator()]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    console.log(this.registerForm.value)
    this.authService.register(this.registerForm.value).subscribe(
      response => {
        const modalRef = this.modalService.open(SuccessfulModalComponent, { centered: true , backdrop: 'static', keyboard: false , size: 'sm' });
        modalRef.componentInstance.title = 'Registro exitoso';
        console.log(response);
      });
  }
}
