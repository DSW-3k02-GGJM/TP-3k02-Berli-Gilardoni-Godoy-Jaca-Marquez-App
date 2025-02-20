// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// RxJS
import { Observable } from 'rxjs';

// Services
import { UserApiService } from '@core/user/services/user.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';
import { EmailValidationService } from '@shared/services/validations/email-validation.service';

// Interfaces
import { UserResponse } from '@core/user/interfaces/user-response.interface';
import { UserInput } from '@core/user/interfaces/user-input.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    PreventEnterDirective,
  ],
})
export class UserFormComponent implements OnInit {
  hide: WritableSignal<boolean> = signal(true);

  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentUserId: number = -1;
  currentEmail: string = '';
  pending: boolean = false;

  userForm: FormGroup = new FormGroup(
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
        this.userAgeValidationService.userAgeValidation(),
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
    { updateOn: 'blur' }
  );

  constructor(
    private readonly userApiService: UserApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly userAgeValidationService: UserAgeValidationService,
    private readonly emailValidationService: EmailValidationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentUserId = params['id'];

        const mode: string = this.currentUserId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.userForm.controls['documentID'].setAsyncValidators([
          this.userApiService.uniqueDocumentIDValidator(this.currentUserId),
        ]);

        if (mode === 'Edit') {
          this.loadUserData();
        } else {
          this.setupCreationFields();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nuevo usuario' : 'Editar usuario',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadUserData(): void {
    this.userApiService.getOne(this.currentUserId).subscribe({
      next: (response: UserResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private setupCreationFields(): void {
    this.userForm.addControl(
      'email',
      new FormControl(
        '',
        [Validators.required, this.emailValidationService.emailValidation()],
        [this.userApiService.uniqueEmailValidator()]
      )
    );
    this.userForm.addControl(
      'password',
      new FormControl('', [Validators.required])
    );
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (!this.userForm.invalid) {
      this.pending = true;
      this.getUserRequest().subscribe({
        next: (response: Message) => this.handleSubmitSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getUserRequest(): Observable<Message> {
    const data = this.userForm.value as UserInput;
    return this.formData.action === 'Create'
      ? this.userApiService.create(data)
      : this.userApiService.update(this.currentUserId, data);
  }

  private handleLoadSuccess(response: UserResponse): void {
    this.currentEmail = response.data.email;
    this.userForm.patchValue(response.data);
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToUsers();
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    const goTo = error.status === 500 ? '/home' : '/staff/users';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToUsers(): void {
    this.router.navigate(['/staff/users']);
  }
}
