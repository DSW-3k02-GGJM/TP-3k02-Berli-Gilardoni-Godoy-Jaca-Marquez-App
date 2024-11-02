import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DateFilterService } from '../../shared/date-filter.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from "../../service/api.service.js";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-vehicle-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgForOf],
  providers: [ApiService],
  templateUrl: './vehicle-filter.component.html',
  styleUrls: ['./vehicle-filter.component.scss'],
})
export class VehicleFilterComponent implements OnInit {
  title: string ='Filtrar por fecha y sucursal';
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  locations: any[] = [];
  /*
  startDate1: Date | null = null;
  endDate1: Date | null = null;*/
  startDate1: Date | null = null;
  endDate1: Date | null = null;

  // enviamos las fechas a la list componente
  @Output() filterApplied = new EventEmitter<{ startDate: string; endDate: string, location: string }>();
  //constructor(private dateFilterService: DateFilterService) {}

  constructor(
    private apiService: ApiService,
    public activeModal: NgbActiveModal,
  ) {}

  vehicleFilterForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.apiService.getAll('locations').subscribe((response) => {
      this.locations = response.data;
    });
  }

  // el botoncito
  applyFilter() {
    if (this.vehicleFilterForm.valid) {
      const formData = this.vehicleFilterForm.value;
      this.filterApplied.emit({
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        location: formData.location || ''
      });
      this.activeModal.close();
    }
  }
}

// PROBAR ESTO DESPUES -----------------------------
// ES PARA PASAR LAS FECHAS AL COMPONENTE CARD
/*
import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle-filter',
  templateUrl: './vehicle-filter.component.html',
  styleUrls: ['./vehicle-filter.component.css']
})
export class VehicleFilterComponent {
  location: string = '';
  locations: any[] = [];
  startDate1: Date | null = null;
  endDate1: Date | null = null;

  @Output() filterApplied = new EventEmitter<{ startDate: string; endDate: string; location: string }>();

  constructor(
    private apiService: ApiService,
    public activeModal: NgbActiveModal,
  ) {}

  vehicleFilterForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  });

  applyFilter() {
    const startDate = this.vehicleFilterForm.get('startDate')?.value;
    const endDate = this.vehicleFilterForm.get('endDate')?.value;
    const location = this.vehicleFilterForm.get('location')?.value;

    this.filterApplied.emit({ startDate, endDate, location });
  }
}
*/
