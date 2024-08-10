import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
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
  action: string = '';
  currentClientId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientCreatedOrModifiedService: ClientCreatedOrModifiedService
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

    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.apiService
          .getOne('clientes', Number(params.id))
          .subscribe((response) => {
            this.currentClientId = response.data.id;
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
    });
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
    this.navigateToClients();
  }

  navigateToClients(): void {
    this.router.navigate(['/clientes']);
  }
}
