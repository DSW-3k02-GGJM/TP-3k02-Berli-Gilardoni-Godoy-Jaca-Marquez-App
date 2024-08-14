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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
  providers: [ApiService],
})
export class ColorFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentColorId: number = -1;
  action: string = '';


  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private createdOrModifiedService: CreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  colorForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.createdOrModifiedService.isDataLoaded = false;

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
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar el color existente
      this.apiService
        .update('colores', this.currentColorId, this.colorForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    }
    this.createdOrModifiedService.isDataLoaded = true;
  }

}
