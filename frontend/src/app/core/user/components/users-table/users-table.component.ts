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
import { UserApiService } from '@core/user/services/user.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { FormatDateService } from '@shared/services/utils/format-date.service';

// Components
import { ActionButtonsComponent } from '@shared/components/action-buttons/action-buttons.component';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import {
  DeleteDialogOptions,
  ErrorDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

@Component({
  selector: 'app-users-table',
  standalone: true,
  templateUrl: './users-table.component.html',
  styleUrl: '../../../../shared/styles/generic-table.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    ActionButtonsComponent,
  ],
})
export class UsersTableComponent {
  @Input() users: User[] = [];
  @Output() userDeleted: EventEmitter<void> = new EventEmitter<void>();

  filteredUsers: User[] = [];

  filterForm: FormGroup = new FormGroup({
    searchText: new FormControl(''),
  });

  constructor(
    private readonly userApiService: UserApiService,
    private readonly snackBarService: SnackBarService,
    private readonly openDialogService: OpenDialogService,
    private readonly formatDateService: FormatDateService,
    private readonly router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']?.currentValue !== changes['users']?.previousValue) {
      this.filteredUsers = [...this.users];
      this.filterForm.get('searchText')?.valueChanges.subscribe({
        next: (value: string) => this.applyFilter(value || ''),
      });
    }
  }

  private applyFilter(filterValue: string): void {
    if (filterValue.length < 3) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter((user: User) =>
        user.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  private openDeleteDialog(name: string, id: number): void {
    const dialogRef: MatDialogRef<GenericDialogComponent, boolean> =
      this.openDialogService.delete({
        entity: 'usuario',
        message: `¿Está seguro de que desea eliminar el usuario ${name}?`,
      } as DeleteDialogOptions);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | undefined) => {
        if (result) {
          this.userApiService.delete(id).subscribe({
            next: (response: Message) => this.handleSuccess(response),
            error: (error: HttpErrorResponse) => this.handleError(error),
          });
        }
      },
    });
  }

  private handleSuccess(response: Message): void {
    this.userDeleted.emit();
    this.snackBarService.show(response.message);
  }

  private handleError(error: HttpErrorResponse) {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: error.status === 500 ? '/home' : null,
    } as ErrorDialogOptions);
  }

  formatBirthDate(date: string): string {
    return this.formatDateService.fromDashToSlash(date);
  }

  private getUserFullName(user: ActionButtons): string {
    return 'userSurname' in user && 'userName' in user
      ? `${user.userSurname}, ${user.userName}`
      : '';
  }

  editUser(user: ActionButtons): void {
    this.router.navigate([`/staff/users/${user.id}`]);
  }

  deleteUser(user: ActionButtons): void {
    this.openDeleteDialog(this.getUserFullName(user), user.id);
  }
}
