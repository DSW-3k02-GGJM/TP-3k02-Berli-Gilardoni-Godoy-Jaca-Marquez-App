import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { VehicleCreatedOrModifiedService } from '../vehicle-created-or-modified/vehicle.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class VehicleFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentVehicleId: number = -1;
  action: string = '';
  modelos: any[] = [];
  colors: any[] = [];
  sucursals: any[] = [];

  constructor(
    private apiService: ApiService,
    private vehicleCreatedOrModifiedService: VehicleCreatedOrModifiedService,
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
  ) {}

  vehicleForm = new FormGroup({
    patente: new FormControl('', [Validators.required]),
    anioFabricacion: new FormControl('', [Validators.required]),
    kmRecorridos: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    sucursal: new FormControl('', [Validators.required]),
    imagenRuta: new FormControl(''),
    //imagenRuta: new FormControl('', [Validators.required]), // Control para la ruta de la imagen
  });

  ngOnInit(): void {
    this.vehicleCreatedOrModifiedService.isDataLoaded = false;
    this.loadModelos();
    this.loadColores();
    this.loadSucursales();

    if (this.currentVehicleId != -1) {
      this.apiService
        .getOne('vehiculos', Number(this.currentVehicleId))
        .subscribe((response) => {
          this.vehicleForm.patchValue({
            ...response.data,
            modelo: response.data.modelo.id,
            color: response.data.color.id,
            sucursal: response.data.sucursal.id,
            imagenRuta: response.data.imagenRuta, // Asigna la ruta de la imagen
          });
        });
      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
  }

  loadModelos(): void {
    this.apiService.getAll('modelos').subscribe((response) => {
      this.modelos = response.data;
    });
  }

  loadColores(): void {
    this.apiService.getAll('colores').subscribe((response) => {
      this.colors = response.data;
    });
  }

  loadSucursales(): void {
    this.apiService.getAll('sucursales').subscribe((response) => {
      this.sucursals = response.data;
    });
  }

  /*
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file).subscribe(
        (rutaImagen: string) => {
          this.vehicleForm.patchValue({ imagenRuta: rutaImagen });
          console.log('Ruta de la imagen:', this.vehicleForm.value.imagenRuta);
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    }
  }*/

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Obtén el nombre del archivo
      const fileName = file.name;
  
      // Construye la ruta relativa en tu carpeta assets
      const imageRuta = `assets/img/${fileName}`;
  
      // Aquí puedes usar imageRuta como quieras, por ejemplo:
      this.vehicleForm.patchValue({ imagenRuta: imageRuta });
      console.log('Ruta de la imagen:', imageRuta);
    }
  }
  
  

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.httpClient.post<{ ruta: string }>('/api/upload', formData).pipe(
      map((response) => response.ruta)
    );
  }
  

  onSubmit() {
    if (this.vehicleForm.valid) {

      const formData = this.vehicleForm.value;

    // Modifica el valor de imagenRuta
      if(formData.imagenRuta != null) 
      {
          formData.imagenRuta = formData.imagenRuta.replace('C:/fakepath', 'assets/img/');
      }
     

      console.log('Datos enviados:', formData); // Agrega esta línea para ver los datos que se envían
      this.activeModal.close();
  
      if (this.action === 'Create') {
        this.apiService.create('vehiculos', formData).subscribe((response) => {
          this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
        });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('vehiculos', this.currentVehicleId, formData)
          .subscribe((response) => {
            this.vehicleCreatedOrModifiedService.notifyVehicleCreatedOrModified();
          });
      }
  
      this.vehicleCreatedOrModifiedService.isDataLoaded = true;
    }
  }
  
}

