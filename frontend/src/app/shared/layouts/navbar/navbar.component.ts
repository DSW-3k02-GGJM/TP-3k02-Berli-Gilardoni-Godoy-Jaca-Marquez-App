// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// RxJS
import { Subscription } from 'rxjs';

// Angular Material
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '@security/services/auth.service';

// Components
import { GenericDialogComponent } from '../../components/generic-dialog/generic-dialog.component';

// Interfaces
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit {
  isLogged: boolean = false;
  isAdminOrEmployee: boolean = false;
  profileLink: string = '/home';
  private subscription?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.loginOrLogout.subscribe({
      next: () => {
        this.isLogged = this.authService.isLogged;

        if (this.isLogged) {
          this.authService.getAuthenticatedId().subscribe({
            next: (response: { id: number }) => {
              this.profileLink = `/user/${response.id}`;
            },
            error: () => {
              this.profileLink = '/home';
            },
          });

          this.authService.getAuthenticatedRole().subscribe({
            next: (response: { role: string }) => {
              this.isAdminOrEmployee =
                response.role === 'admin' || response.role === 'employee';
            },
            error: () => {
              this.isAdminOrEmployee = false;
            },
          });
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Cierre de sesión exitoso',
        titleColor: 'dark',
        image: 'assets/generic/checkmark.png',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  showReservationButton(): boolean {
    return this.isLogged && !this.isAdminOrEmployee;
  }

  toggleNavbar(): void {
    const navbar: HTMLElement = document.getElementById('navbarNav')!;
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.openDialog(),
    });
  }
}
