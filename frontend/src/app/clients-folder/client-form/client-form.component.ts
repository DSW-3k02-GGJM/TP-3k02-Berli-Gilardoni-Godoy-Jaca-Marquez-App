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
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  providers: [ApiService],
})
export class ClientFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentClientId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  clientForm = new FormGroup({
    tipoDoc: new FormControl('', [Validators.required]),
    nroDoc: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    domicilio: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    nacionalidad: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.createdOrModifiedService.isDataLoaded = false;

    if (this.currentClientId != -1) {
      this.apiService
        .getOne('clientes', Number(this.currentClientId))
        .subscribe((response) => {
          let fechaNacimientoFormat = this.formatBirthDate(
            response.data.fechaNacimiento
          );
          this.clientForm.patchValue({
            ...response.data,
            fechaNacimiento: fechaNacimientoFormat,
          });
        });
        this.action = 'Edit';
      } else {
        this.action = 'Create';
      }
  }

  formatBirthDate(fechaNacimientoDB: string): string {
    let fechaNacimientoFormat: string = '${year}-${month}-${day}';
    fechaNacimientoFormat = fechaNacimientoFormat.replace(
      '${year}',
      fechaNacimientoDB.substring(0, 4)
    );
    fechaNacimientoFormat = fechaNacimientoFormat.replace(
      '${month}',
      fechaNacimientoDB.substring(5, 7)
    );
    fechaNacimientoFormat = fechaNacimientoFormat.replace(
      '${day}',
      fechaNacimientoDB.substring(8, 10)
    );
    return fechaNacimientoFormat;
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action == 'Create') {
      this.apiService
        .create('clientes', this.clientForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('clientes', this.currentClientId, this.clientForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    }
    this.createdOrModifiedService.isDataLoaded = true;
  }

}
