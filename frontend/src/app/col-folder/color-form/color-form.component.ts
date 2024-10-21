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
import { ColorCreatedOrModifiedService } from '../color-created-or-modified/col.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-color-form',
  standalone: true,
  templateUrl: './color-form.component.html',
  styleUrls: ['../../styles/genericForm.scss'],
  imports: [CommonModule,
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
export class ColorFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentColorId: number = -1;
  action: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private colorCreatedOrModifiedService: ColorCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  colorForm = new FormGroup({
    colorName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.colorCreatedOrModifiedService.isDataLoaded = false;

    this.activatedRoute.params.subscribe(params => {
      this.currentColorId = params['id'];
      if (this.currentColorId) {
        this.apiService
          .getOne('colors', Number(this.currentColorId)) 
          .subscribe((response) => {
            this.colorForm.patchValue(response.data);
            console.log(response.data);
          });
        this.action = 'Edit'; 
        this.title = 'Editar color';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create'; 
        this.title = 'Nuevo color';
        this.buttonText = 'Registrar';
      }
   });
  }

  onSubmit() {
    if(!this.colorForm.invalid) {
      if (this.action === 'Create') {
        this.apiService
          .create('colors', this.colorForm.value)
          .subscribe({
            next: response => {
              this.colorCreatedOrModifiedService.notifyColorCreatedOrModified();
              this.navigateToColors();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('colors', this.currentColorId, this.colorForm.value)
          .subscribe({
            next: response => {
              this.colorCreatedOrModifiedService.notifyColorCreatedOrModified();
              this.navigateToColors();
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

  navigateToColors() {
    this.router.navigate(['/staff/colors']);
  }
}
