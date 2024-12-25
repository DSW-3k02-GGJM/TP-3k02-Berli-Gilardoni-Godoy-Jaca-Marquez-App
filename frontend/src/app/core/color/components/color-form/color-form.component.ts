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
  selector: 'app-color-form',
  standalone: true,
  templateUrl: './color-form.component.html',
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
export class ColorFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentColorId: number = -1;
  action: string = '';
  errorMessage: string = '';
  pending: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  colorForm = new FormGroup(
    {
      colorName: new FormControl('', [Validators.required]),
    },
    { updateOn: 'submit' }
  );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.currentColorId = params['id'];
        if (this.currentColorId) {
          this.action = 'Edit';
          this.title = 'Editar color';
          this.buttonText = 'Guardar cambios';
          this.apiService
            .getOne('colors', Number(this.currentColorId))
            .subscribe({
              next: (response) => this.colorForm.patchValue(response.data),
              error: () =>
                this.snackBarService.show(
                  'Error al obtener la información del color'
                ),
            });
          this.colorForm.controls['colorName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator(
              'colors',
              this.currentColorId
            ),
          ]);
        } else {
          this.action = 'Create';
          this.title = 'Nuevo color';
          this.buttonText = 'Registrar';
          this.colorForm.controls['colorName'].setAsyncValidators([
            this.apiService.uniqueEntityNameValidator('colors', -1),
          ]);
        }
      },
    });
  }

  onSubmit() {
    if (!this.colorForm.invalid) {
      this.pending = true;
      if (this.action === 'Create') {
        this.apiService.create('colors', this.colorForm.value).subscribe({
          next: () => {
            this.pending = false;
            this.navigateToColors();
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
          .update('colors', this.currentColorId, this.colorForm.value)
          .subscribe({
            next: () => {
              this.pending = false;
              this.navigateToColors();
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

  navigateToColors() {
    this.router.navigate(['/staff/colors']);
  }
}
