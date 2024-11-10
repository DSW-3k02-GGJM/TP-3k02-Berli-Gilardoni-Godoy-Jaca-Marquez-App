import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ResCreatedOrModifiedService } from '../res-created-or-modified/res.service.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {map, Observable} from "rxjs";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';

//falta todo lo del service created-or-modified

@Component({
  selector: 'app-res-form',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './res-form.component.html',
  styleUrl: '../../styles/genericForm.scss'
})
export class ResFormComponent implements OnInit{
  title: string = '';
  buttonText: string = '';
  currentResId: number = -1;
  action: string = '';
  errorMessage: string = '';

  users: any[] = [];
  vehicles: any[] = [];

  filteredClients: any[] = [];


  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  resForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    plannedEndDate: new FormControl('', [Validators.required]), //no funciona
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required]),
    licensePlate: new FormControl('', [Validators.required]),
  }, { validators: this.dateLessThan('startDate', 'plannedEndDate') });

  //valida que startDate >= fecha actual y valida que startDate < plannedEndDate
  dateLessThan(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl) => {
      const startDate = formGroup.get(startDateField)?.value;
      const endDate = formGroup.get(endDateField)?.value;
      const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

      if (startDate && new Date(startDate) < new Date(today)) {
        formGroup.get(startDateField)?.setErrors({ dateInvalid: 'La fecha de inicio debe ser igual o mayor a la fecha actual' });
      } else if (startDate && endDate && startDate > endDate) {
        formGroup.get(endDateField)?.setErrors({ dateInvalid: true });
      } else if (!endDate) {
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

    this.activatedRoute.params.subscribe(params => {
      this.currentResId = params['id'];

      if (this.currentResId) {
        this.apiService
          .getOne('reservations', Number(this.currentResId))
          .subscribe((response) => {
            let startDateFormat = this.formatDate(
              response.data.startDate
            );
            let plannedEndDateFormat = this.formatDate(
              response.data.plannedEndDate
            );
            this.filteredClients = this.users.filter(user => user.documentType === response.data.user.documentType)
            console.log('Id del cliente', response.data.user.documentID)

            this.resForm.patchValue({
              startDate: startDateFormat,
              plannedEndDate: plannedEndDateFormat,
              documentType: response.data.user.documentType,
              documentID: response.data.user.id,
              licensePlate: response.data.vehicle.id,
            });
          });
        this.action = 'Edit';
        this.title = 'Editar reserva';
        this.buttonText = 'Guardar cambios';
      } else {
        this.action = 'Create';
        this.title = 'Nueva reserva';
        this.buttonText = 'Registrar';
      }
    });

  }

  formatDate(DateDB: string): string {
    let DateFormat: string = '${year}-${month}-${day}';
    DateFormat = DateFormat.replace(
      '${year}',
      DateDB.substring(0, 4)
    );
    DateFormat = DateFormat.replace(
      '${month}',
      DateDB.substring(5, 7)
    );
    DateFormat = DateFormat.replace(
      '${day}',
      DateDB.substring(8, 10)
    );
    return DateFormat;
  }

  // Método para cargar los clientes
  loadClients(): void {
    this.apiService.getAll('users').subscribe((response) => {
      this.users = response.data;
      console.log(this.users); //para ver que cleintes trae
    });
  }

  // Método para cargar los vehiculos
  loadVehicles(): void {
    this.apiService.getAll('vehicles').subscribe((response) => {
      this.vehicles = response.data;
    });
  }

  //crea un nuevo array de clientes cuyo tipo doc sea el elegido
  onDocumentTypeSelected(event: MatSelectChange): void{
    const selectedDocumentType = event.value;
    console.log('El tipo doc elegido fue:', selectedDocumentType); //para ver el tipo doc elegido
    this.filteredClients = this.users.filter(user => user.documentType === selectedDocumentType)
    console.log(this.filteredClients); //para ver la lista de clientes filtrados por el tipo doc elegido
  }

  onSubmit(){
    const formValues = this.resForm.value;

    console.log(this.resForm.get('startDate')?.errors); //para ver los errores de plannedEndDate
    if (!this.resForm.invalid) {

      const formData = this.resForm.value;

      console.log('Patente seleccionada:', formData.licensePlate); // Para verificar qué patente se selecciona

      // Encontrar el vehículo seleccionado
      const selectedVehicle = this.vehicles.find(vehicle => vehicle.id === Number(formData.licensePlate));

      console.log('Vehículo seleccionado:', selectedVehicle); // Verificar si se encuentra el vehículo

      if (!selectedVehicle) {
        console.error('No se encontró el vehículo seleccionado');
        return; // Detener si no se encuentra el vehículo
      }
        const formattedStartDate = formValues.startDate ? formatDate(formValues.startDate, 'yyyy-MM-dd', 'en-US') : '';
        const formattedPlannedEndDate = formValues.plannedEndDate ? formatDate(formValues.plannedEndDate, 'yyyy-MM-dd', 'en-US') : '';
        const finalData = {
          reservationDate: new Date().toISOString().split('T')[0],
          startDate: formattedStartDate,
          plannedEndDate: formattedPlannedEndDate,
          realEndDate: null,
          cancellationDate: null,
          user: Number(formData.documentID),
          vehicle: Number(formData.licensePlate),
        };


        console.log('Datos enviados:', finalData); // para ver los datos que se envían

        if (this.action === 'Create') {
          this.apiService
          .create('reservations', finalData)
          .subscribe({
            next: response => {
              this.resCreatedOrModifiedService.notifyResCreatedOrModified();
              this.navigateToReservations();
            },
            error: error => {
              if (error.status !== 400) {
                this.errorMessage = "Error en el servidor. Intente de nuevo.";
              }
            }
          });
        } else if (this.action === 'Edit') {
          this.apiService
            .update('reservations', this.currentResId, finalData)
            .subscribe({
              next: response => {
                this.resCreatedOrModifiedService.notifyResCreatedOrModified();
                this.navigateToReservations();
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

  navigateToReservations() {
    this.router.navigate(['/staff/reservations']);
  }
}
