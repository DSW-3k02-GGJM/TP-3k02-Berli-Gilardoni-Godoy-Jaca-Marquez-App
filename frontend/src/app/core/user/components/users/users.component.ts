// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { UserApiService } from '@core/user/services/user.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { UsersTableComponent } from '@core/user/components/users-table/users-table.component';

// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import { UsersResponse } from '@core/user/interfaces/users-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, UsersTableComponent],
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private readonly userApiService: UserApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onUserDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.userApiService.getAll().subscribe({
      next: (response: UsersResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: UsersResponse): void {
    this.users = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newUser(): void {
    this.router.navigate(['/staff/users/create']);
  }
}
