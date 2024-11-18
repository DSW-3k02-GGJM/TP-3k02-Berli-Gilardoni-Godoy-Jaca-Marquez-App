import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { LocationFormComponent } from '../location-form/location-form.component.js';
import { GenericErrorModalComponent } from '../../shared/generic-error-modal/generic-error-modal.component.js';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component.js';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';

@Component({
  selector: 'app-locations-table',
  standalone: true,
  templateUrl: './locations-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', './locations-table.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  providers: [ApiService],
})
export class LocationsTableComponent {
  readonly dialog = inject(MatDialog);

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al eliminar la sucursal',
        message: 'La sucursal no se puede eliminar porque tiene vehiculos asociados.',
        haveRouterLink: false,
      }
    });
  }

  openConfirmDialog(name: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Eliminar sucursal',
        message: `¿Está seguro de que desea eliminar la sucursal ${name}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService
            .delete('locations', Number(id))
            .subscribe({
              next: (response) => {
                this.locationDeleted.emit(id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  this.openErrorDialog();
                }
              }
            });
      }
    });
  }
  @Input() locations!: any[];
  @Output() locationDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  editLocation(location: any): void {
    this.router.navigate(['/staff/locations/' + location.id]);
  }

  deleteLocation(location: any): void {
    this.openConfirmDialog(location.locationName, location.id);
  }
}
