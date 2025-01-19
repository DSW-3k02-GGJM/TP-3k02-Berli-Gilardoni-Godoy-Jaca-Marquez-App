// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Services
import { UserApiService } from '@core/user/services/user.api.service';
import { UserResponse } from '@core/user/interfaces/user-response.interface';
import { UserInput } from '@core/user/interfaces/user-input.interface';
import { FormatDateService } from '@shared/services/utils/format-date.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

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
  hide: WritableSignal<boolean> = signal(true);

  errorMessage: string = '';

  currentUserId: number = -1;
  email: string = '';

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
    private readonly formatDateService: FormatDateService,
    private readonly userAgeValidationService: UserAgeValidationService,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentUserId = params['id'];
        this.userApiService.getOne(this.currentUserId).subscribe({
          next: (response: UserResponse) => {
            const birthDateFormat: string =
              this.formatDateService.removeTimeZoneFromString(
                response.data.birthDate
              );
            this.email = response.data.email;
            this.profileForm.controls['documentID'].setAsyncValidators([
              this.userApiService.uniqueDocumentIDValidator(this.currentUserId),
            ]);
            this.profileForm.patchValue({
              ...response.data,
              birthDate: birthDateFormat,
            });
          },
        });
      },
    });
  }

  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '300px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Cambios registrados',
        titleColor: 'dark',
        image: 'assets/generic/checkmark.png',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  onSubmit(): void {
    if (!this.profileForm.invalid) {
      this.userApiService
        .update(this.currentUserId, this.profileForm.value as UserInput)
        .subscribe({
          next: () => {
            this.openDialog();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status !== 400) {
              this.errorMessage =
                'Error al actualizar el usuario. Intente de nuevo.';
            }
          },
        });
    }
  }
}
