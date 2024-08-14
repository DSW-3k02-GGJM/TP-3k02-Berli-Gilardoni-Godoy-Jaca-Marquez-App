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
import { ClientCreatedOrModifiedService } from '../client-created-or-modified/client-created-or-modified.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class ClientFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentClientId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private clientCreatedOrModifiedService: ClientCreatedOrModifiedService,
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
    this.clientCreatedOrModifiedService.isDataLoaded = false;

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
          this.clientCreatedOrModifiedService.notifyClientCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('clientes', this.currentClientId, this.clientForm.value)
        .subscribe((response) => {
          this.clientCreatedOrModifiedService.notifyClientCreatedOrModified();
        });
    }
    this.clientCreatedOrModifiedService.isDataLoaded = true;
  }
}
