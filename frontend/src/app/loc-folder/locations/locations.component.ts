import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { LocationsTableComponent } from '../locations-table/locations-table.component.js';
import { LocationCreatedOrModifiedService } from '../location-created-or-modified/location.service.js';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locations',
  standalone: true,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  imports: [CommonModule, HttpClientModule, LocationsTableComponent],
  providers: [ApiService],
})
export class LocationsComponent implements OnInit, OnDestroy {
  locations: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private locationCreatedOrModifiedService: LocationCreatedOrModifiedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    this.locationCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onLocationDeleted(locationId: number): void {
    this.locations = this.locations.filter(
      (location) => location.id !== locationId
    );
  }

  fillData() {
    this.subscription =
      this.locationCreatedOrModifiedService.locationCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.locationCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('locations').subscribe((response) => {
      this.locations = response.data;
    });
  }

  newLocation() {
    this.router.navigate(['/staff/locations/create']);
  }
}
