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
import { VehicleModelCreatedOrModifiedService } from '../vehicleModel-created-or-modified/vehicleModel.service.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {map, Observable} from "rxjs";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicleModel-form',
  standalone: true,
  templateUrl: './vehicleModel-form.component.html',
  styleUrls: ['../../styles/genericForm.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    MatSelectModule
  ],
  providers: [ApiService],
})
export class VehicleModelFormComponent implements OnInit {
  title: string = '';
  buttonText: string = '';
  currentVehicleModelId: number = -1;
  action: string = '';
  errorMessage: string = '';

  categories: any[] = []; // Agrega esta propiedad para almacenar las categorías
  brands: any[] = [];

  constructor(
    private apiService: ApiService,
    private vehicleModelCreatedOrModifiedService: VehicleModelCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  vehicleModelForm = new FormGroup({
    vehicleModelName: new FormControl('', [Validators.required]),
    transmissionType: new FormControl('', [Validators.required]),
    passengerCount: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]), // Campo para la categoría
    brand: new FormControl('', [Validators.required]), // Campo para la marca
    imagePath: new FormControl(''),
  });

  ngOnInit(): void {
    // Inicializa la variable isDataLoaded en el servicio para indicar que los datos aún no han sido cargados.
    this.vehicleModelCreatedOrModifiedService.isDataLoaded = false;

    // Llama al métod0 loadCategorias() para obtener la lista de categorías disponibles desde el backend
    // y almacenarlas en una propiedad del componente para usar en el formulario.
    this.loadCategories();
    this.loadBrands();

    this.activatedRoute.params.subscribe(params => {
      this.currentVehicleModelId = params['id'];
   
      if (this.currentVehicleModelId) {
        this.apiService
          .getOne('vehicleModels', Number(this.currentVehicleModelId)) 
          .subscribe((response) => {
            console.log(response.data);
            this.vehicleModelForm.patchValue({
              vehicleModelName: response.data.vehicleModelName,
              transmissionType: response.data.transmissionType,
              passengerCount: response.data.passengerCount,
              category: response.data.category.id,
              brand: response.data.brand.id,
              imagePath: response.data.imagePath,});
          });
        this.action = 'Edit'; 
        this.title = 'Editar modelo';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create'; 
        this.title = 'Nuevo modelo';
        this.buttonText = 'Registrar';
      }
    });

  }

  // Métod0 para cargar las categorías
  loadCategories(): void {
    this.apiService.getAll('categories').subscribe((response) => {
      this.categories = response.data;
    });
  }

  // Métod0 para cargar las marcas
  loadBrands(): void {
    this.apiService.getAll('brands').subscribe((response) => {
      this.brands = response.data;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Obtén el nombre del archivo
      const fileName = file.name;

      // Construye la ruta relativa en tu carpeta assets
      const imagePath = `assets/img/${fileName}`;

      // Aquí puedes usar imagePath como quieras, por ejemplo:
      this.vehicleModelForm.patchValue({ imagePath: imagePath });
      console.log('Ruta de la imagen:', imagePath);
    }
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<{ path: string }>('/api/upload', formData).pipe(
      map((response) => response.path)
    );
  }


  onSubmit() {
    if (!this.vehicleModelForm.invalid) {

      const formData = this.vehicleModelForm.value;

      // Modifica el valor de imagenRuta
      if(formData.imagePath != null)
      {
        //formData.imagenRuta = formData.imagenRuta.replace('C:\fakepath\', 'assets\img\');
        formData.imagePath = formData.imagePath.replace('C:\\fakepath\\', 'assets/img/');

      } // en realidad se guarda como C:\fakepath


      console.log('Datos enviados:', formData); // para ver los datos que se envían

      if (this.action === 'Create') {
        this.apiService
        .create('vehicleModels', formData)
        .subscribe({
          next: response => {
            this.vehicleModelCreatedOrModifiedService.notifyVehicleModelCreatedOrModified();
            this.navigateToVehicleModels();
          },
          error: error => {
            if (error.status !== 400) {
              this.errorMessage = "Error en el servidor. Intente de nuevo.";
            }
          }
        });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('vehicleModels', this.currentVehicleModelId, formData)
          .subscribe({
            next: response => {
              this.vehicleModelCreatedOrModifiedService.notifyVehicleModelCreatedOrModified();
              this.navigateToVehicleModels();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
      }
    }
  }

  navigateToVehicleModels() {
    this.router.navigate(['/staff/vehicleModels']);
  }
  /*
  onSubmit() {
    this.activeModal.close();
    if (this.action === 'Create') {
      this.apiService
        .create('vehicleModels', this.vehicleModelForm.value)
        .subscribe((response) => {
          this.vehicleModelCreatedOrModifiedService.notifyVehicleModelCreatedOrModified();
        });
    } else if (this.action === 'Edit') {
      this.apiService
        .update('vehicleModels', this.currentVehicleModelId, this.vehicleModelForm.value)
        .subscribe((response) => {
          this.vehicleModelCreatedOrModifiedService.notifyVehicleModelCreatedOrModified();
        });
    }
    this.vehicleModelCreatedOrModifiedService.isDataLoaded = true;
  }
*/
}
