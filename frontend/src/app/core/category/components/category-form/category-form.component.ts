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
import { CategoryApiService } from '@core/category/services/category.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { CategoryResponse } from '@core/category/interfaces/category-response.interface';
import { CategoryInput } from '@core/category/interfaces/category-input.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
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
export class CategoryFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentCategoryId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  categoryForm: FormGroup = new FormGroup(
    {
      categoryName: new FormControl('', [Validators.required]),
      categoryDescription: new FormControl('', [Validators.required]),
      pricePerDay: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      depositValue: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly categoryApiService: CategoryApiService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentCategoryId = params['id'];
        if (this.currentCategoryId) {
          this.action = 'Edit';
          this.title = 'Editar categoría';
          this.buttonText = 'Guardar cambios';
          this.categoryApiService.getOne(this.currentCategoryId).subscribe({
            next: (response: CategoryResponse) =>
              this.categoryForm.patchValue(response.data),
            error: () =>
              this.snackBarService.show(
                'Error al obtener la información de la categoría'
              ),
          });
          this.categoryForm.controls['categoryName'].setAsyncValidators([
            this.categoryApiService.uniqueNameValidator(this.currentCategoryId),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nueva categoría';
          this.buttonText = 'Registrar';
          this.categoryForm.controls['categoryName'].setAsyncValidators([
            this.categoryApiService.uniqueNameValidator(-1),
          ]);
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.categoryForm.invalid) {
      this.pending = true;
      if (this.action == 'Create') {
        this.categoryApiService
          .create(this.categoryForm.value as CategoryInput)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToCategories();
            },
            error: (error: HttpErrorResponse) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      } else if (this.action == 'Edit') {
        this.categoryApiService
          .update(
            this.currentCategoryId,
            this.categoryForm.value as CategoryInput
          )
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToCategories();
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

  navigateToCategories(): void {
    this.router.navigate(['/staff/categories']);
  }
}
