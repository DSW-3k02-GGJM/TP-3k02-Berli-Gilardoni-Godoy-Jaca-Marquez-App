// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { UserApiService } from '@core/user/services/user.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Pipes
import { UserFilterPipe } from '@core/user/pipes/user-filter.pipe';

@Component({
  selector: 'app-users-table',
  standalone: true,
  templateUrl: './users-table.component.html',
  styleUrl: '../../../../shared/styles/genericTable.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    UserFilterPipe,
  ],
})
export class UsersTableComponent {
  @Input() users!: User[];
  @Input() errorMessage: string = '';
  @Output() userDeleted = new EventEmitter<void>();

  filterRows: string = '';

  constructor(
    private readonly userApiService: UserApiService,
    private readonly snackBarService: SnackBarService,
    private readonly formatDateService: FormatDateService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  openDeleteDialog(surname: string, name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.dialog.open(GenericDialogComponent, {
        width: '350px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        data: {
          title: 'Eliminar usuario',
          titleColor: 'danger',
          image: 'assets/delete.png',
          message: `¿Está seguro de que desea eliminar al usuario ${surname}, ${name}?`,
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
          this.userApiService.delete(id).subscribe({
            next: () => {
              this.userDeleted.emit();
              this.snackBarService.show(
                'El usuario ha sido eliminado exitosamente'
              );
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.openErrorDialog();
              } else {
                this.snackBarService.show('Error al eliminar el usuario');
              }
            },
          });
        }
      },
    });
  }

  openErrorDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Error al eliminar al usuario',
        titleColor: 'dark',
        image: 'assets/wrongmark.png',
        message:
          'El usuario no se puede eliminar porque tiene reservas asociadas.',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  get filteredUsers(): User[] {
    return this.users.filter((user: User) =>
      user.email.toLowerCase().includes(this.filterRows.toLowerCase())
    );
  }

  formatBirthDate(date: string): string {
    return this.formatDateService.fromDashToSlash(date);
  }

  editUser(user: User): void {
    this.router.navigate([`/staff/users/${user.id}`]);
  }

  deleteUser(user: User): void {
    this.openDeleteDialog(user.userSurname, user.userName, user.id);
  }
}
