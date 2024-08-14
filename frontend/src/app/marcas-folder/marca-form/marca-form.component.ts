import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-marca-form',
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.scss'],
  providers: [ApiService],
})
export class MarcaFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentMarcaId: number = -1;
  action: string = '';


  constructor(
    private apiService: ApiService, // Servicio para interactuar con la API
    private createdOrModifiedService: CreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  marcaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.createdOrModifiedService.isDataLoaded = false;

    // Se ejecuta al inicializar el componente
    if (this.currentMarcaId != -1) {
      // Si hay un ID en los parámetros, es una edición
      this.apiService
        .getOne('marcas', Number(this.currentMarcaId)) // Obtiene los datos de la marca por ID
        .subscribe((response) => {
          this.marcaForm.patchValue(response.data);
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
        .create('marcas', this.marcaForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      // Si la acción es 'Edit', llama al servicio para actualizar la marca existente
      this.apiService
        .update('marcas', this.currentMarcaId, this.marcaForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    }
    this.createdOrModifiedService.isDataLoaded = true;
  }

}
