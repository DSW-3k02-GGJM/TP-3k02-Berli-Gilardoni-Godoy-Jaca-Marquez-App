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

// Services
import { ColorApiService } from '@core/color/services/color.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { ColorResponse } from '@core/color/interfaces/color-response.interface';
import { ColorInput } from '@core/color/interfaces/color-input.interface';
import { FormData } from '@shared/interfaces/form-data.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-color-form',
  standalone: true,
  templateUrl: './color-form.component.html',
  styleUrl: '../../../../shared/styles/genericForm.scss',
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
  errorMessage: string = '';
  pending: boolean = false;

  colorForm: FormGroup = new FormGroup(
    { colorName: new FormControl('', [Validators.required]) },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly colorApiService: ColorApiService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentColorId = params['id'];
        if (this.currentColorId) {
          this.assignFormData('Edit');
          this.colorApiService.getOne(this.currentColorId).subscribe({
            next: (response: ColorResponse) =>
              this.colorForm.patchValue(response.data),
            error: () =>
              this.snackBarService.show(
                'Error al obtener la información del color'
              ),
          });
          this.colorForm.controls['colorName'].setAsyncValidators([
            this.colorApiService.uniqueNameValidator(this.currentColorId),
          ]);
        } else {
          this.assignFormData('Create');
          this.colorForm.controls['colorName'].setAsyncValidators([
            this.colorApiService.uniqueNameValidator(-1),
          ]);
        }
      },
    });
  }

  assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nuevo color' : 'Editar color',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  onSubmit(): void {
    if (!this.colorForm.invalid) {
      this.pending = true;
      if (this.formData.action === 'Create') {
        this.colorApiService
          .create(this.colorForm.value as ColorInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToColors();
            },
            error: (error: HttpErrorResponse) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      } else if (this.formData.action === 'Edit') {
        this.colorApiService
          .update(this.currentColorId, this.colorForm.value as ColorInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToColors();
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

  navigateToColors(): void {
    this.router.navigate(['/staff/colors']);
  }
}
