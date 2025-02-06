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
import { ColorApiService } from '@core/color/services/color.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { ColorResponse } from '@core/color/interfaces/color-response.interface';
import { ColorInput } from '@core/color/interfaces/color-input.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-color-form',
  standalone: true,
  templateUrl: './color-form.component.html',
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
export class ColorFormComponent implements OnInit {
  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentColorId: number = -1;
  pending: boolean = false;

  colorForm: FormGroup = new FormGroup(
    {
      colorName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$'),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly colorApiService: ColorApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentColorId = params['id'];

        const mode: string = this.currentColorId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.colorForm.controls['colorName'].setAsyncValidators([
          this.colorApiService.uniqueNameValidator(this.currentColorId),
        ]);

        if (mode === 'Edit') {
          this.loadColorData();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nuevo color' : 'Editar color',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadColorData(): void {
    this.colorApiService.getOne(this.currentColorId).subscribe({
      next: (response: ColorResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  onSubmit(): void {
    if (!this.colorForm.invalid) {
      this.pending = true;
      this.getColorRequest().subscribe({
        next: (response: Message) => this.handleSubmitSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getColorRequest(): Observable<Message> {
    const data = this.colorForm.value as ColorInput;
    return this.formData.action === 'Create'
      ? this.colorApiService.create(data)
      : this.colorApiService.update(this.currentColorId, data);
  }

  private handleLoadSuccess(response: ColorResponse): void {
    this.colorForm.patchValue(response.data);
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToColors();
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    const goTo = error.status === 500 ? '/home' : '/staff/colors';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToColors(): void {
    this.router.navigate(['/staff/colors']);
  }
}
