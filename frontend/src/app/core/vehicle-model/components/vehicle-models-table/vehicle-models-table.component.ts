// Angular
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ConfirmDeletionDialogComponent } from '@shared/components/confirm-deletion-dialog/confirm-deletion-dialog.component';
import { GenericErrorDialogComponent } from '@shared/components/generic-error-dialog/generic-error-dialog.component';

// Pipes
import { FilterPipe } from '@shared/pipes/filter/filter.pipe';

@Component({
  selector: 'app-vehicle-models-table',
  standalone: true,
  templateUrl: './vehicle-models-table.component.html',
  styleUrls: [
    '../../../../shared/styles/genericSearchInput.scss',
    '../../../../shared/styles/genericTable.scss',
  ],
  imports: [
    CommonModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class VehicleModelsTableComponent {
  @Input() vehicleModels!: any[];
  @Input() errorMessage: string = '';
  @Output() vehicleModelDeleted = new EventEmitter<number>();

  filterRows: string = '';

  constructor(
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Eliminar modelo',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar el modelo ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService.delete('vehicle-models', Number(id)).subscribe({
            next: (response) => {
              const imagePath = response.data;
              this.httpClient.delete(`/api/upload/${imagePath}`).subscribe({
                next: () => {
                  this.vehicleModelDeleted.emit(id);
                  this.snackBarService.show(
                    'El modelo ha sido eliminado exitosamente'
                  );
                },
              });
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar el modelo');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar el modelo',
        message:
          'El modelo no se puede eliminar porque tiene vehiculos asociados.',
        haveRouterLink: false,
      },
    });
  }

  get filteredVehicleModels() {
    return this.vehicleModels.filter((vehicleModel) =>
      vehicleModel.vehicleModelName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  editVehicleModel(vehicleModel: any): void {
    this.router.navigate(['/staff/vehicle-models/' + vehicleModel.id]);
  }

  deleteVehicleModel(vehicleModel: any): void {
    this.openDeleteDialog(vehicleModel.vehicleModelName, vehicleModel.id);
  }
}
