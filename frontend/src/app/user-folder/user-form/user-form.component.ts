import { Component, Input, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { UserCreatedOrModifiedService } from '../user-created-or-modified/user.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../service/auth.service.js';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: [ '../../styles/genericForm.scss'],
  imports: [CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [ApiService],
})
export class UserFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentUserId: number = -1;
  currentEmail: string = '';
  action: string = '';
  errorMessage: string = '';

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private authService: AuthService,
    private userCreatedOrModifiedService: UserCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  userForm = new FormGroup<any>({
    role: new FormControl('', [Validators.required]),
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    userName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$")]),
    userSurname: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$")]),
    birthDate: new FormControl('', [Validators.required, this.dateLessThan('birthDate')]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(7)]),
    nationality: new FormControl('', [Validators.required]),

  },
    { validators: this.dateLessThan('birthDate'),  updateOn: 'submit'  }
  );

  ngOnInit(): void {
    this.userCreatedOrModifiedService.isDataLoaded = false;

    this.activatedRoute.params.subscribe(params => {
      this.currentUserId = params['id'];

      if (this.currentUserId) {
        this.authService
          .findUser(Number(this.currentUserId))
          .subscribe((response) => {
            let birthDateFormat = this.formatBirthDate(
              response.data.birthDate
            );
            this.currentEmail = response.data.email;
            this.currentUserId = response.data.id;
            this.userForm.controls['documentID'].setAsyncValidators([this.authService.uniqueDocumentIDValidator(this.currentUserId)]);
            this.userForm.patchValue({
              ...response.data,
              birthDate: birthDateFormat,
            });
          });
        this.action = 'Edit';
        this.title = 'Editar usuario';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create';
        this.title = 'Nuevo usuario';
        this.buttonText = 'Registrar';
        this.userForm.addControl('email', new FormControl('', [Validators.required, Validators.email],[this.authService.uniqueEmailValidator()]));
        this.userForm.controls['documentID'].setAsyncValidators([this.authService.uniqueDocumentIDValidator(-1)]);
        this.userForm.addControl('password', new FormControl('', [Validators.required]));
      }
    });
  }

  onSubmit() {
    if(this.userForm.valid) {
      if (this.action === 'Create') {
        this.authService
          .createUser(this.userForm.value)
          .subscribe({
            next: response => {
              this.userCreatedOrModifiedService.notifyUserCreatedOrModified();
              this.navigateToUsers();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
              console.log(error);
            }
          });
      } else if (this.action === 'Edit') {
        this.authService
          .updateUser(this.currentUserId, this.userForm.value)
          .subscribe({
            next: response => {

              this.userCreatedOrModifiedService.notifyUserCreatedOrModified();
              this.navigateToUsers();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
              console.log(error);
            }
          });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  formatBirthDate(birthDateDB: string): string {
    let birthDateFormat: string = '${year}-${month}-${day}';
    birthDateFormat = birthDateFormat.replace(
      '${year}',
      birthDateDB.substring(0, 4)
    );
    birthDateFormat = birthDateFormat.replace(
      '${month}',
      birthDateDB.substring(5, 7)
    );
    birthDateFormat = birthDateFormat.replace(
      '${day}',
      birthDateDB.substring(8, 10)
    );
    return birthDateFormat;
  }

  dateLessThan(birthDateField: string) {
    return (formGroup: AbstractControl) => {
      const birthDate = formGroup.get(birthDateField)?.value;
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
      if (birthDate && new Date(birthDate) > new Date(minAgeDate)) {
        formGroup.get(birthDateField)?.setErrors({
          dateInvalid:
            'Debe ser mayor de edad',
        })
      } else {
        formGroup.get(birthDateField)?.setErrors(null);
      }
      return null;
      }
    };

  navigateToUsers() {
    this.router.navigate(['/staff/users']);
  }
}
