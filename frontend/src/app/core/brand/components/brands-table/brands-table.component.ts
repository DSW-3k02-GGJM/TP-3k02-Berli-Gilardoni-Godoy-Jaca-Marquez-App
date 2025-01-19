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
import { BrandApiService } from '@core/brand/services/brand.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

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
  @Input() errorMessage: string = '';
  @Output() brandDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly brandApiService: BrandApiService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.dialog.open(GenericDialogComponent, {
        width: '350px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: {
          title: 'Eliminar marca',
          titleColor: 'danger',
          image: 'assets/generic/delete.png',
          message: `¿Está seguro de que desea eliminar la marca ${name}?`,
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
          this.brandApiService.delete(id).subscribe({
            next: () => {
              this.brandDeleted.emit();
              this.snackBarService.show(
                'La marca ha sido eliminada exitosamente'
              );
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog(error.error.message);
              } else {
                this.snackBarService.show('Error al eliminar la marca');
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
        title: 'Error al eliminar la marca',
        titleColor: 'dark',
        image: 'assets/generic/wrongmark.png',
        message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredBrands(): Brand[] {
    return this.brands.filter((brand: Brand) =>
      brand.brandName.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  getBrandName(brand: ActionButtons): string {
    return 'brandName' in brand ? brand.brandName : '';
  }

  editBrand(brand: ActionButtons): void {
    this.router.navigate([`/staff/brands/${brand.id}`]);
  }

  deleteBrand(brand: ActionButtons): void {
    this.openDeleteDialog(this.getBrandName(brand), brand.id);
  }
}
