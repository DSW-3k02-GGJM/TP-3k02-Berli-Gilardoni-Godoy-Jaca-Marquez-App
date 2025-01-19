// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { LocationApiService } from '@core/location/services/location.api.service';

// Components
import { LocationsTableComponent } from '@core/location/components/locations-table/locations-table.component';

// Interfaces
import { Location } from '@core/location/interfaces/location.interface';
import { LocationsResponse } from '@core/location/interfaces/locations-response.interface';

@Component({
  selector: 'app-locations',
  standalone: true,
  templateUrl: './locations.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, LocationsTableComponent],
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];
  errorMessage: string = '';

  constructor(
    private readonly locationApiService: LocationApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onLocationDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.locationApiService.getAll().subscribe({
      next: (response: LocationsResponse) => (this.locations = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newLocation(): void {
    this.router.navigate(['/staff/locations/create']);
  }
}
