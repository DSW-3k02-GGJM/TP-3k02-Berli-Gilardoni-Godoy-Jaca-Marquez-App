// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

// RxJS
import { Observable } from 'rxjs';

// Services
import { LocationApiService } from '@core/location/services/location.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { LocationResponse } from '@core/location/interfaces/location-response.interface';
import { LocationInput } from '@core/location/interfaces/location-input.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-location-form',
  standalone: true,
  templateUrl: './location-form.component.html',
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
    PreventEnterDirective,
  ],
})
export class LocationFormComponent implements OnInit {
  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentLocationId: number = -1;
  pending: boolean = false;

  locationForm: FormGroup = new FormGroup(
    {
      locationName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$'),
      ]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly locationApiService: LocationApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentLocationId = params['id'];

        const mode: string = this.currentLocationId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.locationForm.controls['locationName'].setAsyncValidators([
          this.locationApiService.uniqueNameValidator(this.currentLocationId),
        ]);

        if (mode === 'Edit') {
          this.loadLocationData();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nueva sucursal' : 'Editar sucursal',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadLocationData(): void {
    this.locationApiService.getOne(this.currentLocationId).subscribe({
      next: (response: LocationResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  onSubmit(): void {
    if (!this.locationForm.invalid) {
      this.pending = true;
      this.getLocationRequest().subscribe({
        next: (response: Message) => this.handleSubmitSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getLocationRequest(): Observable<Message> {
    const data = this.locationForm.value as LocationInput;
    return this.formData.action === 'Create'
      ? this.locationApiService.create(data)
      : this.locationApiService.update(this.currentLocationId, data);
  }

  private handleLoadSuccess(response: LocationResponse): void {
    this.locationForm.patchValue(response.data);
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToLocations();
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    const goTo = error.status === 500 ? '/home' : '/staff/locations';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToLocations(): void {
    this.router.navigate(['/staff/locations']);
  }
}
