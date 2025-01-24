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
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { BrandFilterPipe } from '@core/brand/pipes/brand-filter.pipe';

@Component({
  selector: 'app-brands-table',
  standalone: true,
  templateUrl: './brands-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    BrandFilterPipe,
    ActionButtonsComponent,
  ],
})
export class BrandsTableComponent {
  @Input() brands: Brand[] = [];
  @Output() brandDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly brandApiService: BrandApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  private openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'marca',
        message: `¿Está seguro de que desea eliminar la marca ${name}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.brandApiService.delete(id).subscribe({
            next: (response: Message) => this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: Message): void {
    this.brandDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
  }

  get filteredBrands(): Brand[] {
    return this.brands.filter((brand: Brand) =>
      brand.brandName.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  private getBrandName(brand: ActionButtons): string {
    return 'brandName' in brand ? brand.brandName : '';
  }

  editBrand(brand: ActionButtons): void {
    this.router.navigate([`/staff/brands/${brand.id}`]);
  }

  deleteBrand(brand: ActionButtons): void {
    this.openDeleteDialog(this.getBrandName(brand), brand.id);
  }
}
