import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf } from '@angular/common';
import { SharedService } from '../../service/shared.service.ts.service'; // rari esto

@Component({
  selector: 'app-vehicle-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgForOf],
  providers: [ApiService],
  templateUrl: './vehicle-filter.component.html',
  styleUrls: ['./vehicle-filter.component.scss'],
})
export class VehicleFilterComponent implements OnInit {
  title: string = 'Filtrar por fecha y sucursal';
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  locations: any[] = [];

  @Output() filterApplied = new EventEmitter<{ startDate: string; endDate: string; location: string }>();

  vehicleFilterForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  });

  constructor(
    private apiService: ApiService,
    public activeModal: NgbActiveModal,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations(): void {
    this.apiService.getAll('locations').subscribe((response) => {
      this.locations = response.data;
    });
  }

  applyFilter() {
    if (this.vehicleFilterForm.valid) {
      const formData = this.vehicleFilterForm.value;
      this.sharedService.setStartDate(formData.startDate || '');
      this.sharedService.setEndDate(formData.endDate || '');
      this.filterApplied.emit({
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        location: formData.location || ''
      });
      this.activeModal.close();
    }
  }
}
