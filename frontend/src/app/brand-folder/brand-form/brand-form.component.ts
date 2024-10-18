import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { BrandCreatedOrModifiedService } from '../brand-created-or-modified/brand.service.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  templateUrl: './brand-form.component.html',
  styleUrls: ['../../styles/genericForm.scss'],
  imports: [CommonModule, 
    HttpClientModule, 
    ReactiveFormsModule, 
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    MatSelectModule],
  providers: [ApiService],
})
export class BrandFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentBrandId: number = -1;
  action: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private brandCreatedOrModifiedService: BrandCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  brandForm = new FormGroup({
    brandName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.brandCreatedOrModifiedService.isDataLoaded = false;
    
    this.activatedRoute.params.subscribe(params => {
      this.currentBrandId = params['id'];
        // Si hay un ID en los parámetros, es una edición
      if (this.currentBrandId) {
        this.apiService
          .getOne('brands', Number(this.currentBrandId)) // Obtiene los datos de la marca por ID
          .subscribe((response) => {
            this.brandForm.patchValue(response.data);
          });
        this.action = 'Edit'; // Establece la acción como 'Edit'
        this.title = 'Editar marca';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create'; // Establece la acción como 'Create' si no hay ID
        this.title = 'Nueva marca';
        this.buttonText = 'Aceptar';
      }
   });
  }

  onSubmit() {
    if(!this.brandForm.invalid) {
      if (this.action === 'Create') {
        // Si la acción es 'Create', llama al servicio para crear una nueva marca
        this.apiService
          .create('brands', this.brandForm.value)
          .subscribe({
            next: response => {
              this.brandCreatedOrModifiedService.notifyBrandCreatedOrModified();
              this.navigateToBrands();
            },
            error: error => {
              if (error.status !== 401) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      } else if (this.action === 'Edit') {
        // Si la acción es 'Edit', llama al servicio para actualizar la marca existente
        this.apiService
          .update('brands', this.currentBrandId, this.brandForm.value)
          .subscribe({
            next: response => {
              
              this.brandCreatedOrModifiedService.notifyBrandCreatedOrModified();
              this.navigateToBrands();
            },
            error: error => {
              if (error.status !== 401) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      }
    }
  }

  navigateToBrands() {
    this.router.navigate(['/brands']);
  }
}
