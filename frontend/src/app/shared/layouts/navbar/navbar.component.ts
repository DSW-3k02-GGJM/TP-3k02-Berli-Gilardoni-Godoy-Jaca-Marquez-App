// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// RxJS
import { Subscription } from 'rxjs';

// Angular Material
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '../../services/auth/auth.service';

// Components
import { GenericSuccessDialogComponent } from '../../../shared/components/generic-success-dialog/generic-success-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLogged = false;
  isAdminOrEmployee = false;
  profileLink = '/home';
  private subscription?: Subscription;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.subscription = this.authService.loginOrLogout.subscribe({
      next: () => {
        this.isLogged = this.authService.isLogged;
        if (!this.isLogged) {
          this.isAdminOrEmployee = false;
        }

        this.authService.getAuthenticatedId().subscribe({
          next: (response) => {
            this.profileLink = '/user/' + response.id;
          },
          error: () => {
            this.profileLink = '/home';
          },
        });

        this.authService.getAuthenticatedRole().subscribe({
          next: (response) => {
            this.isAdminOrEmployee =
              response.role === 'employee' || response.role === 'admin';
          },
          error: () => {
            this.isAdminOrEmployee = false;
          },
        });
      },
    });

    if (!this.authService.isLogged) {
      this.isAdminOrEmployee = false;
      this.isLogged = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Cierre de sesión exitoso',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.openDialog(),
    });
  }
}
