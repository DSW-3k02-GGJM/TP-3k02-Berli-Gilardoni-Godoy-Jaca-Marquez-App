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
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { BrandResponse } from '@core/brand/interfaces/brand-response.interface';
import { BrandInput } from '@core/brand/interfaces/brand-input.interface';
import { FormData } from '@shared/interfaces/form-data.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  templateUrl: './brand-form.component.html',
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
export class BrandFormComponent implements OnInit {
  formData: FormData = {
    action: '',
    title: '',
    buttonText: '',
  };
  currentBrandId: number = -1;
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
    private readonly openDialogService: OpenDialogService,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentBrandId = params['id'];

        const mode: string = this.currentBrandId ? 'Edit' : 'Create';
        this.assignFormData(mode);

        this.brandForm.controls['brandName'].setAsyncValidators([
          this.brandApiService.uniqueNameValidator(this.currentBrandId),
        ]);

        if (mode === 'Edit') {
          this.loadBrandData();
        }
      },
    });
  }

  private assignFormData(action: string): void {
    this.formData = {
      action,
      title: action === 'Create' ? 'Nueva marca' : 'Editar marca',
      buttonText: action === 'Create' ? 'Registrar' : 'Guardar cambios',
    } as FormData;
  }

  private loadBrandData(): void {
    this.brandApiService.getOne(this.currentBrandId).subscribe({
      next: (response: BrandResponse) => this.handleLoadSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  onSubmit(): void {
    if (!this.brandForm.invalid) {
      this.pending = true;
      this.getBrandRequest().subscribe({
        next: (response: Message) => this.handleSubmitSuccess(response),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
    }
  }

  private getBrandRequest(): Observable<Message> {
    const data = this.brandForm.value as BrandInput;
    return this.formData.action === 'Create'
      ? this.brandApiService.create(data)
      : this.brandApiService.update(this.currentBrandId, data);
  }

  private handleLoadSuccess(response: BrandResponse): void {
    this.brandForm.patchValue(response.data);
  }

  private handleSubmitSuccess(response: Message): void {
    this.pending = false;
    this.snackBarService.show(response.message);
    this.navigateToBrands();
  }

  private handleError(error: HttpErrorResponse): void {
    this.pending = false;
    this.openErrorDialog(error);
  }

  private openErrorDialog(error: HttpErrorResponse): void {
    const goTo = error.status === 500 ? '/home' : '/staff/brands';
    this.openDialogService.error({
      message: error.error?.message,
      goTo,
    } as ErrorDialogOptions);
  }

  navigateToBrands(): void {
    this.router.navigate(['/staff/brands']);
  }
}
