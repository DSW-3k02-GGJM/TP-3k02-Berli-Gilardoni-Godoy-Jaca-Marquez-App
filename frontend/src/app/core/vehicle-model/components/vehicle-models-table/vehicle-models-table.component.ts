// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { ImageApiService } from '@shared/services/api/image.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { UploadImageResponse } from '@shared/interfaces/upload-image-response.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

@Component({
  selector: 'app-vehicle-models-table',
  standalone: true,
  templateUrl: './vehicle-models-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    ActionButtonsComponent,
  ],
})
export class VehicleModelsTableComponent {
  @Input() vehicleModels: VehicleModel[] = [];
  @Output() vehicleModelDeleted: EventEmitter<void> = new EventEmitter<void>();

  filteredVehicleModels: VehicleModel[] = [];

  filterForm: FormGroup = new FormGroup({
    searchText: new FormControl(''),
  });

  constructor(
    private readonly vehicleModelApiService: VehicleModelApiService,
    private readonly imageApiService: ImageApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['vehicleModels']?.currentValue !==
      changes['vehicleModels']?.previousValue
    ) {
      this.filteredVehicleModels = [...this.vehicleModels];
      this.filterForm.get('searchText')?.valueChanges.subscribe({
        next: (value: string) => this.applyFilter(value || ''),
      });
    }
  }

  private applyFilter(filterValue: string): void {
    if (filterValue.length < 3) {
      this.filteredVehicleModels = [...this.vehicleModels];
    } else {
      this.filteredVehicleModels = this.vehicleModels.filter(
        (vehicleModel: VehicleModel) =>
          vehicleModel.vehicleModelName
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }
  }

  private openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'modelo',
        message: `¿Está seguro de que desea eliminar el modelo ${name}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.vehicleModelApiService.delete(id).subscribe({
            next: (response: UploadImageResponse) =>
              this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: UploadImageResponse): void {
    this.deleteImage(response.imagePath ?? '');

    this.vehicleModelDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
  }

  private deleteImage(imagePath: string): void {
    this.imageApiService.deleteImage(imagePath).subscribe({
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
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

  private getVehicleModelName(vehicleModel: ActionButtons): string {
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
