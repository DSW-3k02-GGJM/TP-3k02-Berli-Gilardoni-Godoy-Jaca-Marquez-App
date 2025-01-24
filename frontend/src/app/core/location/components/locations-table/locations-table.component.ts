// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { LocationApiService } from '@core/location/services/location.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Location } from '@core/location/interfaces/location.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { LocationFilterPipe } from '@core/location/pipes/location-filter.pipe';

@Component({
  selector: 'app-locations-table',
  standalone: true,
  templateUrl: './locations-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    LocationFilterPipe,
    ActionButtonsComponent,
  ],
})
export class LocationsTableComponent {
  @Input() locations: Location[] = [];
  @Output() locationDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly locationApiService: LocationApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  private openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'sucursal',
        message: `¿Está seguro de que desea eliminar la sucursal ${name}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.locationApiService.delete(id).subscribe({
            next: (response: Message) => this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: Message): void {
    this.locationDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
  }

  get filteredLocations(): Location[] {
    return this.locations.filter((location: Location) =>
      location.locationName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  private getLocationName(location: ActionButtons): string {
    return 'locationName' in location ? location.locationName : '';
  }

  editLocation(location: ActionButtons): void {
    this.router.navigate([`/staff/locations/${location.id}`]);
  }

  deleteLocation(location: ActionButtons): void {
    this.openDeleteDialog(this.getLocationName(location), location.id);
  }
}
