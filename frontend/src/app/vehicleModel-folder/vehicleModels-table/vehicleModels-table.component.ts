import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component.js';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';

@Component({
  selector: 'app-vehicleModels-table',
  standalone: true,
  templateUrl: './vehicleModels-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', './vehicleModels-table.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  providers: [ApiService],
})
export class VehicleModelsTableComponent {
  readonly dialog = inject(MatDialog);

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al eliminar el modelo',
        message: 'El modelo no se puede eliminar porque tiene vehiculos asociados.',
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
              title: 'Eliminar modelo',
              titleColor: 'danger',
              image: 'assets/delete.png',
              message: `¿Está seguro de que desea eliminar el modelo ${name}?`,
              buttonTitle: 'Eliminar',
              buttonColor: 'danger',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService
            .delete('vehicleModels', Number(id))
            .subscribe({
              next: (response) => {
                this.vehicleModelDeleted.emit(id);
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
  @Input() vehicleModels!: any[];
  @Output() vehicleModelDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService, 
    private router: Router
  ) {}

  editVehicleModel(vehicleModel: any): void {
    this.router.navigate(['/staff/vehicleModels/' + vehicleModel.id]);
  }

  deleteVehicleModel(vehicleModel: any): void {
    this.openConfirmDialog(vehicleModel.vehicleModelName, vehicleModel.id);
  }
}
