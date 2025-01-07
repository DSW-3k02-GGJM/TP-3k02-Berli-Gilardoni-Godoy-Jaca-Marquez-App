// Angular
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: '../../../../shared/styles/genericForm.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [ApiService],
})
export class CategoryFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentCategoryId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  categoryForm = new FormGroup(
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

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentCategoryId = params['id'];

        if (this.currentCategoryId) {
          this.action = 'Edit';
          this.title = 'Editar categoría';
          this.buttonText = 'Guardar cambios';
          this.apiService
            .getOne('categories', Number(this.currentCategoryId))
            .subscribe({
              next: (response) => this.categoryForm.patchValue(response.data),
              error: () =>
                this.snackBarService.show(
                  'Error al obtener la información de la categoría'
                ),
            });
          this.categoryForm.controls['categoryName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator(
              'categories',
              this.currentCategoryId
            ),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nueva categoría';
          this.buttonText = 'Registrar';
          this.categoryForm.controls['categoryName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator('categories', -1),
          ]);
        }
      },
    });
  }

  onSubmit() {
    if (!this.categoryForm.invalid) {
      this.pending = true;
      if (this.action == 'Create') {
        this.apiService
          .create('categories', this.categoryForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigatesToCategories();
            },
            error: (error) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      } else if (this.action == 'Edit') {
        this.apiService
          .update('categories', this.currentCategoryId, this.categoryForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigatesToCategories();
            },
            error: (error) => {
              this.pending = false;
              if (error.status !== 400) {
                this.errorMessage = 'Error en el servidor. Intente de nuevo.';
              }
            },
          });
      }
    }
  }

  navigatesToCategories() {
    this.router.navigate(['/staff/categories']);
  }
}
