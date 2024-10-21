import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersTableComponent } from '../users-table/users-table.component.js';
import { ApiService } from '../../service/api.service.js';
import { Router } from '@angular/router';
import { UserCreatedOrModifiedService } from '../user-created-or-modified/user.service.js';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service.js';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, UsersTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [AuthService],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: any[] = [];
  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private userCreatedOrModifiedService: UserCreatedOrModifiedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    this.userCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onUserDeleted(userId: number): void {
    this.users = this.users.filter(
      (user) => user.id !== userId
    );
  }

  fillData() {
    this.subscription =
      this.userCreatedOrModifiedService.userCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.userCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.authService.getAllUsers().subscribe((response) => {
      this.users = response.data;
    });
  }

  newUser() {
    this.router.navigate(['/staff/users/create']); //cambiar por 
  }
}
