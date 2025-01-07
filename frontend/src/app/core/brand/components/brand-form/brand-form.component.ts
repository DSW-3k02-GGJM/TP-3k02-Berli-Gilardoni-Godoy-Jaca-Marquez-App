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
import { ApiService } from '../../../../shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  templateUrl: './brand-form.component.html',
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
})
export class BrandFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentBrandId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  brandForm = new FormGroup(
    {
      brandName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s-]+$'),
      ]),
    },
    { updateOn: 'blur' }
  );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentBrandId = params['id'];

        if (this.currentBrandId) {
          this.action = 'Edit';
          this.title = 'Editar marca';
          this.buttonText = 'Guardar cambios';
          this.apiService
            .getOne('brands', Number(this.currentBrandId))
            .subscribe({
              next: (response) => this.brandForm.patchValue(response.data),
              error: () =>
                this.snackBarService.show(
                  'Error al obtener la información de la marca'
                ),
            });
          this.brandForm.controls['brandName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator(
              'brands',
              this.currentBrandId
            ),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nueva marca';
          this.buttonText = 'Registrar';
          this.brandForm.controls['brandName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator('brands', -1),
          ]);
        }
      },
    });
  }

  onSubmit() {
    if (!this.brandForm.invalid) {
      this.pending = true;
      if (this.action === 'Create') {
        this.apiService.create('brands', this.brandForm.value).subscribe({
          next: () => {
            this.pending = false;
            this.navigateToBrands();
          },
          error: (error) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            }
          },
        });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('brands', this.currentBrandId, this.brandForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToBrands();
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

  navigateToBrands(): void {
    this.router.navigate(['/staff/brands']);
  }
}
