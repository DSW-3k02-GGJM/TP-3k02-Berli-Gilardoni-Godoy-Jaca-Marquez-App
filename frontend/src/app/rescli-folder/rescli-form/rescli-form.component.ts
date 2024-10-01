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
import { ResCreatedOrModifiedService } from '../rescli-created-or-modified/rescli.service.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateFilterService } from '../../shared/date-filter.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-res-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './rescli-form.component.html',
  styleUrl: './rescli-form.component.scss'
})
export class ResFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentResId: number = -1;
  action: string = '';
  clients: any[] = [];
  vehicles: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  filteredClients: any[] = [];

  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    public activeModal: NgbActiveModal,
    private dateFilterService: DateFilterService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  resForm = new FormGroup({
    plannedEndDate: new FormControl('', [Validators.required]),
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required]),
    licensePlate: new FormControl('', [Validators.required]),
  }, { validators: this.dateLessThan('startDate', 'plannedEndDate') });

  dateLessThan(startDateField: string, endDateField: string) {
    return (formGroup: AbstractControl) => {
      const startDate = this.startDate; // Usar la fecha del filtro
      const endDate = formGroup.get(endDateField)?.value;
      const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

      if (startDate && new Date(startDate) < new Date(today)) {
        formGroup.get(startDateField)?.setErrors({ dateInvalid: 'La fecha de inicio debe ser igual o mayor a la fecha actual' });
      } else if (startDate && endDate && startDate >= endDate) {
        formGroup.get(endDateField)?.setErrors({ dateInvalid: true });
      } else {
        formGroup.get(endDateField)?.setErrors(null);
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.dateFilterService.startDate$.subscribe(date => {
      this.startDate = date;
      console.log('Fecha de inicio del filtro:', this.startDate); // Verificar la fecha de inicio
    });
    this.dateFilterService.endDate$.subscribe(date => {
      this.endDate = date;
      console.log('Fecha de fin del filtro:', this.endDate); // Verificar la fecha de fin
    });

    this.resCreatedOrModifiedService.isDataLoaded = false;

    this.loadClients();
    this.loadVehicles();

    if (this.currentResId != -1) {
      this.apiService
        .getOne('reservations', Number(this.currentResId))
        .subscribe((response) => {
          let startDateFormat = this.formatDate(
            response.data.startDate
          );
          let plannedEndDateFormat = this.formatDate(
            response.data.plannedEndDate
          );
          this.filteredClients = this.clients.filter(client => client.documentType === response.data.client.documentType)
          console.log('Id del cliente', response.data.client.documentID)

          this.resForm.patchValue({
            plannedEndDate: plannedEndDateFormat,
            documentType: response.data.client.documentType,
            documentID: response.data.client.id,
            licensePlate: response.data.vehicle.id,
          });
        });

      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
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

  loadClients(): void {
    this.apiService.getAll('clients').subscribe((response) => {
      this.clients = response.data;
      console.log(this.clients);
    });
  }

  loadVehicles(): void {
    this.apiService.getAll('vehicles').subscribe((response) => {
      this.vehicles = response.data;
    });
  }

  onDocumentTypeSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedDocumentType = selectElement.value;
    console.log('El tipo doc elegido fue:', selectedDocumentType);
    this.filteredClients = this.clients.filter(client => client.documentType === selectedDocumentType)
    console.log(this.filteredClients);
  }

  onSubmit() {
    if (this.resForm.valid) {
      if (!this.startDate || !this.endDate) {
        console.error('Las fechas del filtro no están definidas');
        return;
      }

      const formData = {
        ...this.resForm.value,
        startDate: this.startDate,
        endDate: this.endDate
      };

      console.log('Datos del formulario:', formData);

      const selectedVehicle = this.vehicles.find(vehicle => vehicle.id === Number(formData.licensePlate));

      if (!selectedVehicle) {
        console.error('No se encontró el vehículo seleccionado');
        return;
      }

      const finalData = {
        reservationDate: new Date().toISOString().split('T')[0],
        startDate: formData.startDate,
        plannedEndDate: formData.plannedEndDate,
        realEndDate: null,
        cancellationDate: null,
        initialKms: 0,
        finalKm: null,
        client: Number(formData.documentID),
        vehicle: Number(formData.licensePlate),
      };

      console.log('Datos enviados:', finalData);

      this.activeModal.close();

      if (this.action === 'Create') {
        this.apiService.create('reservations', finalData).subscribe(
          (response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          },
          (error) => {
            console.error('Error al crear la reserva:', error);
          }
        );
      } else if (this.action === 'Edit') {
        this.apiService.update('reservations', this.currentResId, finalData).subscribe(
          (response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          },
          (error) => {
            console.error('Error al actualizar la reserva:', error);
          }
        );
      }

      this.resCreatedOrModifiedService.isDataLoaded = true;
    }
  }
}