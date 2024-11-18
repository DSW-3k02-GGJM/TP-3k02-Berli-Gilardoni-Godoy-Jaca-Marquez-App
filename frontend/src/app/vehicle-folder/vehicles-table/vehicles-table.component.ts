import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component.js';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  templateUrl: './vehicles-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', './vehicles-table.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  providers: [ApiService],
})
export class VehiclesTableComponent {
  readonly dialog = inject(MatDialog);

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al eliminar el vehículo',	
        message: 'El vehículo no se puede eliminar porque tiene reservas asociadas.',
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
        title: 'Eliminar vehículo',
        message: `¿Está seguro de que desea eliminar el vehículo ${name}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService
            .delete('vehicles', Number(id))
            .subscribe({
              next: (response) => {
                this.vehicleDeleted.emit(id);
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
  @Input() vehicles!: any[];
  @Output() vehicleDeleted = new EventEmitter()
  filterRows = '';

  constructor(
    private apiService: ApiService, 
    private router: Router
  ) {}

  editVehicle(vehicle: any): void {
    this.router.navigate(['/staff/vehiclesS/' + vehicle.id]);
  }

  deleteVehicle(vehicle: any): void {
    this.openConfirmDialog(vehicle.licensePlate, vehicle.id);
  }
}
