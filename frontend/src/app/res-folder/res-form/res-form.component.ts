import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ResCreatedOrModifiedService } from '../res-created-or-modified/res.service.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
//falta todo lo del service created-or-modified

@Component({
  selector: 'app-res-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './res-form.component.html',
  styleUrl: './res-form.component.scss',
})
export class ResFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentResId: number = -1;
  action: string = '';
  clients: any[] = [];
  vehicles: any[] = [];

  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    public activeModal: NgbActiveModal,
    private httpClient: HttpClient
  ) {}

  resForm = new FormGroup(
    {
      startDate: new FormControl('', [Validators.required]),
      plannedEndDate: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      documentID: new FormControl('', [Validators.required]),
      licensePlate: new FormControl('', [Validators.required]),
    },
    { validators: this.dateLessThan('startDate', 'plannedEndDate') }
  );

  //valida que startDate >= fecha actual y valida que startDate < plannedEndDate
  dateLessThan(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl) => {
      const startDate = formGroup.get(startDateField)?.value;
      const endDate = formGroup.get(endDateField)?.value;
      const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

      if (startDate && new Date(startDate) < new Date(today)) {
        formGroup.get(startDateField)?.setErrors({
          dateInvalid:
            'La fecha de inicio debe ser igual o mayor a la fecha actual',
        });
      } else if (startDate && endDate && startDate >= endDate) {
        formGroup.get(endDateField)?.setErrors({ dateInvalid: true });
      } else {
        formGroup.get(endDateField)?.setErrors(null);
      }
      return null;
    };
  }

  ngOnInit(): void {
    // Inicializa la variable isDataLoaded en el servicio para indicar que los datos aún no han sido cargados.
    this.resCreatedOrModifiedService.isDataLoaded = false;

    // Llama al método loadClients() para obtener la lista de clientes disponibles desde el backend
    // y almacenarlas en una propiedad del componente para usar en el formulario.
    this.loadClients();
    this.loadVehicles();

    if (this.currentResId != -1) {
      // Si el parámetro 'id' está presente en la ruta, significa que estamos en el modo de edición.
      // Realiza una solicitud al backend para obtener los detalles de la reseva con el ID proporcionado.
      this.apiService
        .getOne('reservations', Number(this.currentResId))
        .subscribe((response) => {
          let startDateFormat = this.formatDate(response.data.startDate);
          let plannedEndDateFormat = this.formatDate(
            response.data.plannedEndDate
          );

          this.resForm.patchValue({
            startDate: startDateFormat,
            plannedEndDate: plannedEndDateFormat,
            documentType: response.data.client.id,
            documentID: response.data.client.id,
            licensePlate: response.data.vehicle.id,
          });
        });

      // Establece la acción como 'Edit' para indicar que estamos editando una reserva existente.
      this.action = 'Edit';
    } else {
      // Si no hay un parámetro 'id' en la ruta, significa que estamos en el modo de creación de una nueva reserva.
      // Establece la acción como 'Create'.
      this.action = 'Create';
    }
  }

  formatDate(DateDB: string): string {
    let DateFormat: string = '${year}-${month}-${day}';
    DateFormat = DateFormat.replace('${year}', DateDB.substring(0, 4));
    DateFormat = DateFormat.replace('${month}', DateDB.substring(5, 7));
    DateFormat = DateFormat.replace('${day}', DateDB.substring(8, 10));
    return DateFormat;
  }

  // Método para cargar los clientes
  loadClients(): void {
    this.apiService.getAll('clients').subscribe((response) => {
      this.clients = response.data;
    });
  }

  // Método para cargar los vehiculos
  loadVehicles(): void {
    this.apiService.getAll('vehicles').subscribe((response) => {
      this.vehicles = response.data;
    });
  }

  onSubmit() {
    if (this.resForm.valid) {
      const formData = this.resForm.value;

      console.log('Patente seleccionada:', formData.licensePlate); // Para verificar qué patente se selecciona

      // Encontrar el vehículo seleccionado: compara por patente ya que eso es lo que se elige del vehiculo en el select --> ?????
      // const selectedVehicle = this.vehicles.find(
      //   (vehicle) => vehicle.id === Number(formData.licensePlate)
      // );

      // console.log('Vehículo seleccionado:', selectedVehicle); // Verificar si se encuentra el vehículo

      // if (!selectedVehicle) {
      //   console.error('No se encontró el vehículo seleccionado');
      //   return; // Detener si no se encuentra el vehículo
      // }
      const finalData = {
        reservationDate: new Date().toISOString().split('T')[0],
        startDate: formData.startDate,
        plannedEndDate: formData.plannedEndDate,
        realEndDate: null,
        cancellationDate: null,
        initialKms: 0, // Revisar, debería ser null apenas se crea la reserva
        finalKm: null,
        client: Number(formData.documentID),
        vehicle: Number(formData.licensePlate),
      };

      /*
      const finalData = {
        ...formData,
        ...additionalData
      };*/

      console.log('Datos enviados:', finalData); // para ver los datos que se envían
      this.activeModal.close();

      if (this.action === 'Create') {
        this.apiService
          .create('reservations', finalData)
          .subscribe((response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          });
      } else if (this.action === 'Edit') {
        this.apiService
          .update('reservations', this.currentResId, finalData)
          .subscribe((response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          });
      }

      this.resCreatedOrModifiedService.isDataLoaded = true;
    }
  }
}
