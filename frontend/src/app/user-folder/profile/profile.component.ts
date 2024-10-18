import { Component, OnInit, signal } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  idUsuario: number = -1;
  hide = signal(true);
  errorMessage: string = '';

  email: string = '';
  id: number = -1;

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  profileForm = new FormGroup({
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    userName: new FormControl('', [Validators.required]),
    userSurname: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required, this.authService.maxDateValidator]), //TODO: ver si parsea bien la fecha
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]), //TODO: añadir validador de telefono
    nationality: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUsuario = params['id'];
      this.authService.findUser(this.idUsuario).subscribe(response => {
        this.email = response.data.email;
        this.id = response.data.id;
        this.profileForm.controls['documentID'].setAsyncValidators([this.authService.uniqueDocumentIDValidator(this.id)]);
        this.profileForm.patchValue(response.data);
      });
    });
  }

  onSubmit() {
    if (!this.profileForm.invalid) {
      this.authService.updateUser(this.idUsuario, this.profileForm.value).subscribe({
        next: response => {
          const modalRef = this.modalService.open(SuccessfulModalComponent, { centered: true , backdrop: 'static', keyboard: false , size: 'sm' });
          modalRef.componentInstance.title = 'Usuario actualizado';
        },
        error: error => {
          if (error.status !== 400) {
            this.errorMessage = "Error al actualizar el usuario. Intente de nuevo.";
            console.log(error);
          }

        }
      });
    }   
  }
}
