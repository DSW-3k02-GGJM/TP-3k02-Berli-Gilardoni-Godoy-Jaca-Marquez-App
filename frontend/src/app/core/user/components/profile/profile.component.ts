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
import { AuthService } from '@shared/services/auth/auth.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';
import { UserAgeValidationService } from '@shared/services/validations/user-age-validation.service';

// Components
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  hide: WritableSignal<boolean> = signal(true);

  errorMessage: string = '';

  id: number = -1;
  idUsuario: number = -1;
  email: string = '';

  profileForm = new FormGroup({
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    userName: new FormControl('', [Validators.required]),
    userSurname: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [
      Validators.required,
      this.userAgeValidationService.validateUserAge('birthDate'),
    ]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(7),
    ]),
    nationality: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private formatDateService: FormatDateService,
    private userAgeValidationService: UserAgeValidationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.idUsuario = params['id'];
        this.authService.findUser(this.idUsuario).subscribe({
          next: (response) => {
            let birthDateFormat =
              this.formatDateService.removeTimeZoneFromString(
                response.data.birthDate
              );
            this.id = response.data.id;
            this.email = response.data.email;
            this.profileForm.controls['documentID'].setAsyncValidators([
              this.authService.uniqueDocumentIDValidator(this.id),
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

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '300px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Cambios registrados',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  onSubmit() {
    if (!this.profileForm.invalid) {
      this.authService
        .updateUser(this.idUsuario, this.profileForm.value)
        .subscribe({
          next: () => {
            this.openDialog();
          },
          error: (error) => {
            if (error.status !== 400) {
              this.errorMessage =
                'Error al actualizar el usuario. Intente de nuevo.';
            }
          },
        });
    }
  }
}
