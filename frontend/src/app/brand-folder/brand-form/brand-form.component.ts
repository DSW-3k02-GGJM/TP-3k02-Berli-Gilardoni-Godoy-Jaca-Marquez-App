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

@Component({
  selector: 'app-brand-form',
  standalone: true,
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class BrandFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentBrandId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private brandCreatedOrModifiedService: BrandCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  brandForm = new FormGroup({
    brandName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.brandCreatedOrModifiedService.isDataLoaded = false;

    // Se ejecuta al inicializar el componente
    if (this.currentBrandId != -1) {
      // Si hay un ID en los parámetros, es una edición
      this.apiService
        .getOne('brands', Number(this.currentBrandId)) // Obtiene los datos de la marca por ID
        .subscribe((response) => {
          this.brandForm.patchValue(response.data);
        });
      this.action = 'Edit'; // Establece la acción como 'Edit'
    } else {
      this.action = 'Create'; // Establece la acción como 'Create' si no hay ID
    }
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action === 'Create') {
      // Si la acción es 'Create', llama al servicio para crear una nueva marca
      this.apiService
        .create('brands', this.brandForm.value)
        .subscribe((response) => {
          this.brandCreatedOrModifiedService.notifyBrandCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar la marca existente
      this.apiService
        .update('brands', this.currentBrandId, this.brandForm.value)
        .subscribe((response) => {
          this.brandCreatedOrModifiedService.notifyBrandCreatedOrModified();
        });
    }
    this.brandCreatedOrModifiedService.isDataLoaded = true;
  }
}
