// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { LocationApiService } from '@core/location/services/location.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { LocationsTableComponent } from '@core/location/components/locations-table/locations-table.component';

// Interfaces
import { Location } from '@core/location/interfaces/location.interface';
import { LocationsResponse } from '@core/location/interfaces/locations-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-locations',
  standalone: true,
  templateUrl: './locations.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, LocationsTableComponent],
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];

  constructor(
    private readonly locationApiService: LocationApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onLocationDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.locationApiService.getAll().subscribe({
      next: (response: LocationsResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: LocationsResponse): void {
    this.locations = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newLocation(): void {
    this.router.navigate(['/staff/locations/create']);
  }
}
