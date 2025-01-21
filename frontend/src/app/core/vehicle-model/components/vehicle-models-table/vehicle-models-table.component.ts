// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { ImageApiService } from '@shared/services/api/image.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { UploadImageResponse } from '@shared/interfaces/upload-image-response.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { VehicleModelFilterPipe } from '@core/vehicle-model/pipes/vehicle-model-filter.pipe';

@Component({
  selector: 'app-vehicle-models-table',
  standalone: true,
  templateUrl: './vehicle-models-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    VehicleModelFilterPipe,
    ActionButtonsComponent,
  ],
})
export class VehicleModelsTableComponent {
  @Input() vehicleModels: VehicleModel[] = [];
  @Input() errorMessage: string = '';
  @Output() vehicleModelDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly vehicleModelApiService: VehicleModelApiService,
    private readonly imageApiService: ImageApiService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  deleteImage(imagePath: string): void {
    this.imageApiService.deleteImage(imagePath).subscribe({
      next: () => {
        this.vehicleModelDeleted.emit();
        this.snackBarService.show('El modelo ha sido eliminado correctamente');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status !== 400) {
          this.errorMessage = 'Error en el servidor. Intente de nuevo.';
        }
      },
    });
  }

  openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.dialog.open(GenericDialogComponent, {
        width: '350px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: {
          title: 'Eliminar modelo',
          titleColor: 'danger',
          image: 'assets/generic/delete.png',
          message: `¿Está seguro de que desea eliminar el modelo ${name}?`,
          showBackButton: true,
          backButtonTitle: 'Volver',
          mainButtonTitle: 'Eliminar',
          mainButtonColor: 'bg-danger',
          haveRouterLink: false,
        },
      } as GenericDialog);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.vehicleModelApiService.delete(id).subscribe({
            next: (response: UploadImageResponse) => {
              this.deleteImage(response.imagePath ?? '');
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog(error.error.message);
              } else {
                this.snackBarService.show('Error al eliminar el modelo');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar el modelo',
        titleColor: 'dark',
        image: 'assets/generic/wrongmark.png',
        message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredVehicleModels(): VehicleModel[] {
    return this.vehicleModels.filter((vehicleModel: VehicleModel) =>
      vehicleModel.vehicleModelName
        .toLowerCase()
        .includes(this.filterRows.toLowerCase())
    );
  }

  getBrandName(vehicleModel: VehicleModel): string {
    return typeof vehicleModel.brand === 'object'
      ? vehicleModel.brand.brandName
      : '';
  }

  getCategoryName(vehicleModel: VehicleModel): string {
    return typeof vehicleModel.category === 'object'
      ? vehicleModel.category.categoryName
      : '';
  }

  getVehicleModelName(vehicleModel: ActionButtons): string {
    return 'vehicleModelName' in vehicleModel
      ? vehicleModel.vehicleModelName
      : '';
  }

  editVehicleModel(vehicleModel: ActionButtons): void {
    this.router.navigate([`/staff/vehicle-models/${vehicleModel.id}`]);
  }

  deleteVehicleModel(vehicleModel: ActionButtons): void {
    this.openDeleteDialog(
      this.getVehicleModelName(vehicleModel),
      vehicleModel.id
    );
  }
}
