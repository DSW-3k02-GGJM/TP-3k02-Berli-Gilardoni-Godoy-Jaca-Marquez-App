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
import { CategoryApiService } from '@core/category/services/category.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { CategoryResponse } from '@core/category/interfaces/category-response.interface';
import { CategoryInput } from '@core/category/interfaces/category-input.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
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
export class CategoryFormComponent implements OnInit {
  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentCategoryId: number = -1;
  pending: boolean = false;

  categoryForm: FormGroup = new FormGroup(
    {
      categoryName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$'),
      ]),
      categoryDescription: new FormControl('', [Validators.required]),
      pricePerDay: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^\d+$/),
      ]),
      depositValue: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^\d+$/),
      ]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private readonly categoryApiService: CategoryApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentCategoryId = params['id'];

        const mode: string = this.currentCategoryId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.categoryForm.controls['categoryName'].setAsyncValidators([
          this.categoryApiService.uniqueNameValidator(this.currentCategoryId),
        ]);

        if (mode === 'Edit') {
          this.loadCategoryData();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nueva categoría' : 'Editar categoría',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadCategoryData(): void {
    this.categoryApiService.getOne(this.currentCategoryId).subscribe({
      next: (response: CategoryResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  onSubmit(): void {
    if (!this.categoryForm.invalid) {
      this.pending = true;
      this.getCategoryRequest().subscribe({
        next: (response: Message) => this.handleSubmitSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getCategoryRequest(): Observable<Message> {
    const data = this.categoryForm.value as CategoryInput;
    return this.formData.action === 'Create'
      ? this.categoryApiService.create(data)
      : this.categoryApiService.update(this.currentCategoryId, data);
  }

  private handleLoadSuccess(response: CategoryResponse): void {
    this.categoryForm.patchValue(response.data);
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToCategories();
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    const goTo = error.status === 500 ? '/home' : '/staff/categories';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToCategories(): void {
    this.router.navigate(['/staff/categories']);
  }
}
