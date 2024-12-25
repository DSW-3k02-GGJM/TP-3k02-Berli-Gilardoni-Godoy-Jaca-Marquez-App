// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { LocationsTableComponent } from '../locations-table/locations-table.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  imports: [CommonModule, LocationsTableComponent],
})
export class LocationsComponent {
  locations: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onLocationDeleted(locationId: number): void {
    this.locations = this.locations.filter(
      (location) => location.id !== locationId
    );
  }

  fillData() {
    this.apiService.getAll('locations').subscribe({
      next: (response) => (this.locations = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newLocation() {
    this.router.navigate(['/staff/locations/create']);
  }
}
