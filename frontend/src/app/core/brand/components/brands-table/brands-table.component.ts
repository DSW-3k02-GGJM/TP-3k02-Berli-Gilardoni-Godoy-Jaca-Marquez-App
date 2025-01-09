// Angular
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-brands-table',
  standalone: true,
  templateUrl: './brands-table.component.html',
  styleUrl: '../../../../shared/styles/genericTable.scss',
  imports: [
    CommonModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class BrandsTableComponent {
  @Input() brands!: any[];
  @Input() errorMessage: string = '';
  @Output() brandDeleted = new EventEmitter<number>();

  filterRows: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  openDeleteDialog(name: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Eliminar marca',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar la marca ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.apiService.delete('brands', Number(id)).subscribe({
            next: () => {
              this.brandDeleted.emit(id);
              this.snackBarService.show(
                'La marca ha sido eliminada exitosamente'
              );
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar la marca');
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
        title: 'Error al eliminar la marca',
        message:
          'La marca no se puede eliminar porque tiene modelos asociados.',
        haveRouterLink: false,
      },
    });
  }

  get filteredBrands() {
    return this.brands.filter((brand) =>
      brand.brandName.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  editBrand(brand: any): void {
    this.router.navigate(['/staff/brands/' + brand.id]);
  }

  deleteBrand(brand: any): void {
    this.openDeleteDialog(brand.brandName, brand.id);
  }
}
