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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Services
import { AuthService } from '@security/services/auth.service';
import { UserApiService } from '@core/user/services/user.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Interfaces
import { UserInput } from '@core/user/interfaces/user-input.interface';
import {
  ErrorDialogOptions,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    PreventEnterDirective,
  ],
})
export class RegisterComponent {
  hide: WritableSignal<boolean> = signal(true);

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
        [
          Validators.required,
          Validators.pattern('^([0-9]{7,8}|[A-Za-z0-9]{6,20})$'),
        ],
        [this.userApiService.uniqueDocumentIDValidator(-1)]
      ),
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
    private readonly openDialogService: OpenDialogService,
    private readonly userAgeValidationService: UserAgeValidationService,
    private readonly emailValidationService: EmailValidationService
  ) {}

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (!this.registerForm.invalid) {
      this.pending = true;
      this.authService
        .register(this.registerForm.value as UserInput)
        .subscribe({
          next: (response: Message) => this.handleSuccess(response),
          error: (error: HttpErrorResponse) => this.handleError(error),
        });
    }
  }

  private handleSuccess(response: Message): void {
    this.pending = false;
    this.openSuccessDialog(response);
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openSuccessDialog(response: Message): void {
    this.openDialogService.success({
      title: response.message,
      message: 'Por favor, revise su correo para verificar su cuenta.',
      goTo: '/home',
    } as SuccessDialogOptions);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }
}
