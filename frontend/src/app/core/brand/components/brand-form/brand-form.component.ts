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
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { BrandResponse } from '@core/brand/interfaces/brand-response.interface';
import { BrandInput } from '@core/brand/interfaces/brand-input.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  templateUrl: './brand-form.component.html',
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
export class BrandFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentBrandId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  brandForm: FormGroup = new FormGroup(
    {
      brandName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s-]+$'),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly brandApiService: BrandApiService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentBrandId = params['id'];
        if (this.currentBrandId) {
          this.action = 'Edit';
          this.title = 'Editar marca';
          this.buttonText = 'Guardar cambios';
          this.brandApiService.getOne(this.currentBrandId).subscribe({
            next: (response: BrandResponse) =>
              this.brandForm.patchValue(response.data),
            error: () =>
              this.snackBarService.show(
                'Error al obtener la información de la marca'
              ),
          });
          this.brandForm.controls['brandName'].setAsyncValidators([
            this.brandApiService.uniqueNameValidator(this.currentBrandId),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nueva marca';
          this.buttonText = 'Registrar';
          this.brandForm.controls['brandName'].setAsyncValidators([
            this.brandApiService.uniqueNameValidator(-1),
          ]);
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.brandForm.invalid) {
      this.pending = true;
      if (this.action === 'Create') {
        this.brandApiService
          .create(this.brandForm.value as BrandInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToBrands();
            },
            error: (error: HttpErrorResponse) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      } else if (this.action === 'Edit') {
        this.brandApiService
          .update(this.currentBrandId, this.brandForm.value as BrandInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToBrands();
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

  navigateToBrands(): void {
    this.router.navigate(['/staff/brands']);
  }
}
