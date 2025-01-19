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
import { ColorApiService } from '@core/color/services/color.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Color } from '@core/color/interfaces/color.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

// Pipes
import { ColorFilterPipe } from '@core/color/pipes/color-filter.pipe';

@Component({
  selector: 'app-colors-table',
  standalone: true,
  templateUrl: './colors-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    ColorFilterPipe,
    ActionButtonsComponent,
  ],
})
export class ColorsTableComponent {
  @Input() colors: Color[] = [];
  @Input() errorMessage: string = '';
  @Output() colorDeleted: EventEmitter<void> = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly colorApiService: ColorApiService,
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
          title: 'Eliminar color',
          titleColor: 'danger',
          image: 'assets/generic/delete.png',
          message: `¿Está seguro de que desea eliminar el color ${name}?`,
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
          this.colorApiService.delete(id).subscribe({
            next: () => {
              this.colorDeleted.emit();
              this.snackBarService.show(
                'El color ha sido eliminado exitosamente'
              );
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog(error.error.message);
              } else {
                this.snackBarService.show('Error al eliminar el color');
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
        title: 'Error al eliminar el color',
        titleColor: 'dark',
        image: 'assets/generic/wrongmark.png',
        message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredColors(): Color[] {
    return this.colors.filter((color: Color) =>
      color.colorName.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  getColorName(color: ActionButtons): string {
    return 'colorName' in color ? color.colorName : '';
  }

  editColor(color: ActionButtons): void {
    this.router.navigate([`/staff/colors/${color.id}`]);
  }

  deleteColor(color: ActionButtons): void {
    this.openDeleteDialog(this.getColorName(color), color.id);
  }
}
