import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-form-floating',
  standalone: true,
  templateUrl: './form-floating.component.html',
  styleUrls: ['./form-floating.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [ApiService],
})
export class FormFloatingComponent {
  tipoDoc = '';
  nroDoc = '';
  nombre = '';
  apellido = '';
  mail = '';
  fechaNacimiento = '';
  domicilio = '';
  telefono = '';
  nacionalidad = '';

  constructor(private apiService: ApiService) {}

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
    this.apiService.create('clientes', formData).subscribe((response) => {
      console.log(response);
    });
  }
}
