import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { LocationCreatedOrModifiedService } from '../location-created-or-modified/location.service.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location-form',
  standalone: true,
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class LocationFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentLocationId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private locationCreatedOrModifiedService: LocationCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  locationForm = new FormGroup({
    locationName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.locationCreatedOrModifiedService.isDataLoaded = false;

    if (this.currentLocationId != -1) {
      this.apiService
        .getOne('locations', Number(this.currentLocationId))
        .subscribe((response) => {
          this.locationForm.patchValue(response.data);
        });
      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action == 'Create') {
      this.apiService
        .create('locations', this.locationForm.value)
        .subscribe((response) => {
          this.locationCreatedOrModifiedService.notifyLocationCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('locations', this.currentLocationId, this.locationForm.value)
        .subscribe((response) => {
          this.locationCreatedOrModifiedService.notifyLocationCreatedOrModified();
        });
    }
    this.locationCreatedOrModifiedService.isDataLoaded = true;
  }
}
