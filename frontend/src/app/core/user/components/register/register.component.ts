// Angular
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@shared/services/auth/auth.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service.js';

// Components
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  hide: WritableSignal<boolean> = signal(true);

  errorMessage: string = '';
  pending: boolean = false;

  registerForm = new FormGroup(
    {
      email: new FormControl(
        '',
        [Validators.required, this.emailValidationService.emailValidation()],
        [this.authService.uniqueEmailValidator()]
      ),
      password: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      documentID: new FormControl(
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
        [this.authService.uniqueDocumentIDValidator(-1)]
      ),
      userName: new FormControl('', [Validators.required]),
      userSurname: new FormControl('', [Validators.required]),
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
    },
    {
      validators: this.userAgeValidationService.userAgeValidation('birthDate'),
      updateOn: 'blur',
    }
  );

  constructor(
    private authService: AuthService,
    private userAgeValidationService: UserAgeValidationService,
    private emailValidationService: EmailValidationService,
    private dialog: MatDialog
  ) {}

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Registro exitoso',
        message: 'Por favor, revise su correo para verificar su cuenta.',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  onSubmit() {
    if (!this.registerForm.invalid) {
      this.pending = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.pending = false;
          this.openDialog();
        },
        error: (error) => {
          this.pending = false;
          if (error.status !== 400) {
            this.errorMessage = 'Error en el servidor. Intente de nuevo.';
          }
        },
      });
    }
  }
}
