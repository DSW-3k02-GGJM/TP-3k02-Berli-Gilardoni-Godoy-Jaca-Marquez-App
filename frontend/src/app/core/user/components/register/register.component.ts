// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, WritableSignal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@security/services/auth.service';
import { UserApiService } from '@core/user/services/user.api.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { UserInput } from '@core/user/interfaces/user-input.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
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
    PreventEnterDirective,
  ],
})
export class RegisterComponent {
  hide: WritableSignal<boolean> = signal(true);

  errorMessage: string = '';
  pending: boolean = false;

  registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl(
        '',
        [Validators.required, this.emailValidationService.emailValidation()],
        [this.userApiService.uniqueEmailValidator()]
      ),
      password: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      documentID: new FormControl(
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
        [this.userApiService.uniqueDocumentIDValidator(-1)]
      ),
      userName: new FormControl('', [Validators.required]),
      userSurname: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [
        Validators.required,
        this.userAgeValidationService.userAgeValidation(),
      ]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
      ]),
      nationality: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly authService: AuthService,
    private readonly userApiService: UserApiService,
    private readonly userAgeValidationService: UserAgeValidationService,
    private readonly emailValidationService: EmailValidationService,
    private readonly dialog: MatDialog
  ) {}

  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Registro exitoso',
        titleColor: 'dark',
        image: 'assets/checkmark.png',
        message: 'Por favor, revise su correo para verificar su cuenta.',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  onSubmit(): void {
    if (!this.registerForm.invalid) {
      this.pending = true;
      this.authService
        .register(this.registerForm.value as UserInput)
        .subscribe({
          next: () => {
            this.pending = false;
            this.openDialog();
          },
          error: (error: HttpErrorResponse) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
    }
  }
}
