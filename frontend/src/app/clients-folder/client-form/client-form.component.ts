import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [ApiService],
})
export class ClientFormComponent implements OnInit {
  action: string = '';
  currentClient: any;

  tipoDoc = '';
  nroDoc = '';
  nombre = '';
  apellido = '';
  mail = '';
  fechaNacimiento = '';
  domicilio = '';
  telefono = '';
  nacionalidad = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.apiService
          .getOne('clientes', Number(params.id))
          .subscribe((response) => {
            this.currentClient = response.data;
            this.setFormValues();
          });
        this.action = 'Edit';
      } else {
        this.action = 'Create';
      }
    });
  }

  onSubmit() {
    const formData = {
      tipoDoc: this.tipoDoc,
      nroDoc: this.nroDoc,
      nombre: this.nombre,
      apellido: this.apellido,
      mail: this.mail,
      fechaNacimiento: this.fechaNacimiento,
      domicilio: this.domicilio,
      telefono: this.telefono,
      nacionalidad: this.nacionalidad,
    };
    if (this.action == 'Create') {
      this.apiService.create('clientes', formData).subscribe((response) => {});
    } else if (this.action == 'Edit') {
      this.apiService
        .update('clientes', this.currentClient.id, formData)
        .subscribe((response) => {});
    }
  }

  navigateToClients(): void {
    this.router.navigate(['/clientes']);
  }

  private async setFormValues(): Promise<void> {
    this.tipoDoc = this.currentClient.tipoDoc;
    this.nroDoc = this.currentClient.nroDoc;
    this.nombre = this.currentClient.nombre;
    this.apellido = this.currentClient.apellido;
    this.mail = this.currentClient.mail;
    this.fechaNacimiento = this.currentClient.fechaNacimiento.substring(0, 10);
    this.domicilio = this.currentClient.domicilio;
    this.telefono = this.currentClient.telefono;
    this.nacionalidad = this.currentClient.nacionalidad;
  }
}
