// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthService } from '@shared/services/auth/auth.service';

// Components
import { UsersTableComponent } from '../users-table/users-table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onUserDeleted(userId: number): void {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  fillData() {
    this.authService.getAllUsers().subscribe({
      next: (response) => (this.users = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newUser() {
    this.router.navigate(['/staff/users/create']);
  }
}
