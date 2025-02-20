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
import { ColorApiService } from '@core/color/services/color.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { Color } from '@core/color/interfaces/color.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

@Component({
  selector: 'app-colors-table',
  standalone: true,
  templateUrl: './colors-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    ActionButtonsComponent,
  ],
})
export class ColorsTableComponent {
  @Input() colors: Color[] = [];
  @Output() colorDeleted: EventEmitter<void> = new EventEmitter<void>();

  filteredColors: Color[] = [];

  filterForm: FormGroup = new FormGroup({
    searchText: new FormControl(''),
  });

  constructor(
    private readonly colorApiService: ColorApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['colors']?.currentValue !== changes['colors']?.previousValue) {
      this.filteredColors = [...this.colors];
      this.filterForm.get('searchText')?.valueChanges.subscribe({
        next: (value: string) => this.applyFilter(value || ''),
      });
    }
  }

  private applyFilter(filterValue: string): void {
    if (filterValue.length < 3) {
      this.filteredColors = [...this.colors];
    } else {
      this.filteredColors = this.colors.filter((color: Color) =>
        color.colorName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  private openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'color',
        message: `¿Está seguro de que desea eliminar el color ${name}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.colorApiService.delete(id).subscribe({
            next: (response: Message) => this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: Message): void {
    this.colorDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
  }

  private getColorName(color: ActionButtons): string {
    return 'colorName' in color ? color.colorName : '';
  }

  editColor(color: ActionButtons): void {
    this.router.navigate([`/staff/colors/${color.id}`]);
  }

  deleteColor(color: ActionButtons): void {
    this.openDeleteDialog(this.getColorName(color), color.id);
  }
}
