import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';
import { CategoryCreatedOrModifiedService } from '../category-created-or-modified/cat.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: '../../styles/genericForm.scss',
  imports: [
    CommonModule, 
    HttpClientModule, 
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    MatSelectModule
  ],
  providers: [ApiService],
})
export class CategoryFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentCategoryId: number = -1;
  action: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private categoryCreatedOrModifiedService: CategoryCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  categoryForm = new FormGroup({
    categoryName: new FormControl('', [Validators.required]),
    categoryDescription: new FormControl('', [Validators.required]),
    pricePerDay: new FormControl('', [Validators.required]),
    depositValue: new FormControl('', [Validators.required]),
  }, { updateOn: 'submit' });

  ngOnInit(): void {
    this.categoryCreatedOrModifiedService.isDataLoaded = false;

    this.activatedRoute.params.subscribe(params => {
      this.currentCategoryId = params['id'];
        // Si hay un ID en los parámetros, es una edición
      if (this.currentCategoryId) {
        this.apiService
          .getOne('categories', Number(this.currentCategoryId)) 
          .subscribe((response) => {
            this.categoryForm.patchValue(response.data);
          });
        this.action = 'Edit'; // Establece la acción como 'Edit'
        this.title = 'Editar categoría';
        this.categoryForm.controls['categoryName'].setAsyncValidators([this.apiService.uniqueEntityNameValidator('categories',this.currentCategoryId)]);
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create';
        this.title = 'Nueva categoría';
        this.categoryForm.controls['categoryName'].setAsyncValidators([this.apiService.uniqueEntityNameValidator('categories',-1)]);
        this.buttonText = 'Registrar';
      }
    });
  }

  onSubmit() {
    if(!this.categoryForm.invalid) {
      if (this.action == 'Create') {
        this.apiService
          .create('categories', this.categoryForm.value)
          .subscribe({
            next: response => {
              this.categoryCreatedOrModifiedService.notifyCategoryCreatedOrModified();
              this.navigatesToCategories();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      } else if (this.action == 'Edit') {
        this.apiService
          .update('categories', this.currentCategoryId, this.categoryForm.value)
          .subscribe({
            next: response => {
              this.categoryCreatedOrModifiedService.notifyCategoryCreatedOrModified();
              this.navigatesToCategories();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      }
    }
  }

  navigatesToCategories() {
    this.router.navigate(['/staff/categories']);
  }
}
