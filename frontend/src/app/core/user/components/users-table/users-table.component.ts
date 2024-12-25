// Angular
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { AuthService } from '@shared/services/auth/auth.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { ConfirmDeletionDialogComponent } from '@shared/components/confirm-deletion-dialog/confirm-deletion-dialog.component';
import { GenericErrorDialogComponent } from '@shared/components/generic-error-dialog/generic-error-dialog.component';

// Pipes
import { FilterPipe } from '@shared/pipes/filter/filter.pipe';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: [
    '../../../../shared/styles/genericSearchInput.scss',
    '../../../../shared/styles/genericTable.scss',
  ],
})
export class UsersTableComponent {
  @Input() users!: any[];
  @Input() errorMessage: string = '';
  @Output() userDeleted = new EventEmitter<number>();

  filterRows: string = '';

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private formatDateService: FormatDateService,
    private router: Router
  ) {}

  openDeleteDialog(name: string, surname: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Eliminar usuario',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: `¿Está seguro de que desea eliminar al usuario ${surname}, ${name}?`,
        buttonTitle: 'Eliminar',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.authService.deleteUser(Number(id)).subscribe({
            next: () => {
              this.userDeleted.emit(id);
            },
            error: (error) => {
              if (error.status === 400) {
                this.openErrorDialog();
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
        title: 'Error al eliminar al usuario',
        message:
          'El usuario no se puede eliminar porque tiene reservas asociadas.',
        haveRouterLink: false,
      },
    });
  }

  get filteredUsers() {
    return this.users.filter((user) =>
      user.email.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  formatBirthDate(date: string): string {
    return this.formatDateService.fromDashToSlash(date);
  }

  editUser(user: any): void {
    this.router.navigate(['/staff/users/' + user.id]);
  }

  deleteUser(user: any): void {
    this.openDeleteDialog(user.userName, user.userSurname, user.id);
  }
}
