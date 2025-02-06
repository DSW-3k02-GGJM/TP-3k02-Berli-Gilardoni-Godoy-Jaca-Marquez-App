// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Services
import { UserApiService } from '@core/user/services/user.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';

// Interfaces
import { UserResponse } from '@core/user/interfaces/user-response.interface';
import { UserInput } from '@core/user/interfaces/user-input.interface';
import {
  ErrorDialogOptions,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: '../../../../shared/styles/generic-form.scss',
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
export class ProfileComponent implements OnInit {
  currentUserId: number = -1;
  currentEmail: string = '';
  pending: boolean = false;

  profileForm: FormGroup = new FormGroup(
    {
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
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly userApiService: UserApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly userAgeValidationService: UserAgeValidationService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentUserId = params['id'];

        this.profileForm.controls['documentID'].setAsyncValidators([
          this.userApiService.uniqueDocumentIDValidator(this.currentUserId),
        ]);

        this.loadUserData();
      },
    });
  }

  private loadUserData(): void {
    this.userApiService.getOne(this.currentUserId).subscribe({
      next: (response: UserResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleLoadSuccess(response: UserResponse): void {
    this.currentEmail = response.data.email;
    this.profileForm.patchValue(response.data);
  }

  onSubmit(): void {
    if (!this.profileForm.invalid) {
      this.pending = true;
      this.userApiService
        .update(this.currentUserId, this.profileForm.value as UserInput)
        .subscribe({
          next: () => this.handleSuccess(),
          error: (error: HttpErrorResponse) => this.handleError(error),
        });
    }
  }

  private handleSuccess(): void {
    this.pending = false;
    this.openSuccessDialog();
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openSuccessDialog(): void {
    this.openDialogService.success({
      title: 'Cambios registrados',
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
