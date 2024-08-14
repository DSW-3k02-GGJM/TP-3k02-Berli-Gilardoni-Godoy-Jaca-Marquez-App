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
import { ColorCreatedOrModifiedService } from '../color-created-or-modified/color.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-color-form',
  standalone: true,
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class ColorFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentColorId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private colorCreatedOrModifiedService: ColorCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  colorForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.colorCreatedOrModifiedService.isDataLoaded = false;

    // Se ejecuta al inicializar el componente
    if (this.currentColorId != -1) {
      this.apiService
        .getOne('colores', Number(this.currentColorId)) // Obtiene los datos del color por ID
        .subscribe((response) => {
          this.colorForm.patchValue(response.data);
        });
      this.action = 'Edit'; // Establece la acción como 'Edit'
    } else {
      this.action = 'Create'; // Establece la acción como 'Create' si no hay ID
    }
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action === 'Create') {
      // Si la acción es 'Create', llama al servicio para crear una nuevo color
      this.apiService
        .create('colores', this.colorForm.value)
        .subscribe((response) => {
          this.colorCreatedOrModifiedService.notifyColorCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar el color existente
      this.apiService
        .update('colores', this.currentColorId, this.colorForm.value)
        .subscribe((response) => {
          this.colorCreatedOrModifiedService.notifyColorCreatedOrModified();
        });
    }
    this.colorCreatedOrModifiedService.isDataLoaded = true;
  }
}
