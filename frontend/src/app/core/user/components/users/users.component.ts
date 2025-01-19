// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { UserApiService } from '@core/user/services/user.api.service';

// Components
import { UsersTableComponent } from '@core/user/components/users-table/users-table.component';

// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import { UsersResponse } from '@core/user/interfaces/users-response.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, UsersTableComponent],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  errorMessage: string = '';

  constructor(
    private readonly userApiService: UserApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onUserDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.userApiService.getAll().subscribe({
      next: (response: UsersResponse) => (this.users = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newUser(): void {
    this.router.navigate(['/staff/users/create']);
  }
}
