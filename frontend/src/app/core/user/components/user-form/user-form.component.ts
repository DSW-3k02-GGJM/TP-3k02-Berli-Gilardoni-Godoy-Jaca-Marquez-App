// Angular
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Services
import { AuthService } from '@shared/services/auth/auth.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service.js';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: [
    './user-form.component.scss',
    '../../../../shared/styles/genericForm.scss',
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
  ],
})
export class UserFormComponent implements OnInit {
  hide: WritableSignal<boolean> = signal(true);

  pending: boolean = false;

  errorMessage: string = '';

  action: string = '';
  currentEmail: string = '';
  currentUserId: number = -1;

  title: string = '';
  buttonText: string = '';

  userForm = new FormGroup<any>(
    {
      role: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      documentType: new FormControl('', [Validators.required]),
      documentID: new FormControl('', [
        Validators.required,
        Validators.pattern('^([0-9]{7,8}|[A-Za-z0-9]{6,20})$'),
      ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$'),
      ]),
      userSurname: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$'),
      ]),
      birthDate: new FormControl('', [
        Validators.required,
        this.userAgeValidationService.userAgeValidation('birthDate'),
      ]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
      ]),
      nationality: new FormControl('', [Validators.required]),
      verified: new FormControl(false, [Validators.required]),
    },
    {
      validators: this.userAgeValidationService.userAgeValidation('birthDate'),
      updateOn: 'blur',
    }
  );

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private formatDateService: FormatDateService,
    private userAgeValidationService: UserAgeValidationService,
    private emailValidationService: EmailValidationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentUserId = params['id'];
        if (this.currentUserId) {
          this.action = 'Edit';
          this.title = 'Editar usuario';
          this.buttonText = 'Guardar cambios';
          this.authService.findUser(Number(this.currentUserId)).subscribe({
            next: (response) => {
              const birthDateFormat =
                this.formatDateService.removeTimeZoneFromString(
                  response.data.birthDate
                );
              this.currentEmail = response.data.email;
              this.currentUserId = response.data.id;
              this.userForm.controls['documentID'].setAsyncValidators([
                this.authService.uniqueDocumentIDValidator(this.currentUserId),
              ]);
              this.userForm.patchValue({
                ...response.data,
                birthDate: birthDateFormat,
              });
            },
            error: () =>
              this.snackBarService.show(
                'Error al obtener la información del usuario'
              ),
          });
        } else {
          this.action = 'Create';
          this.title = 'Nuevo usuario';
          this.buttonText = 'Registrar';
          this.userForm.addControl(
            'email',
            new FormControl(
              '',
              [
                Validators.required,
                this.emailValidationService.emailValidation(),
              ],
              [this.authService.uniqueEmailValidator()]
            )
          );
          this.userForm.addControl(
            'password',
            new FormControl('', [Validators.required])
          );
          this.userForm.controls['documentID'].setAsyncValidators([
            this.authService.uniqueDocumentIDValidator(-1),
          ]);
        }
      },
    });
  }

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    this.userForm.markAllAsTouched();
    this.userForm.updateValueAndValidity();
    if (!this.userForm.invalid) {
      this.pending = true;
      if (this.action === 'Create') {
        this.authService.createUser(this.userForm.value).subscribe({
          next: () => {
            this.pending = false;
            this.navigateToUsers();
          },
          error: (error) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
      } else if (this.action === 'Edit') {
        this.authService
          .updateUser(this.currentUserId, this.userForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToUsers();
            },
            error: (error) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  navigateToUsers() {
    this.router.navigate(['/staff/users']);
  }
}
