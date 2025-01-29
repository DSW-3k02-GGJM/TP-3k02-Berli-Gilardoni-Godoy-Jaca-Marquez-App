// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// RxJS
import { Subscription } from 'rxjs';

// Services
import { AuthService } from '@security/services/auth.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Interfaces
import { SuccessDialogOptions } from '@shared/interfaces/generic-dialog.interface';
import { Message } from '@shared/interfaces/message.interface';

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
    private readonly openDialogService: OpenDialogService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.loginOrLogout.subscribe({
      next: () => {
        this.isLogged = this.authService.isLogged;

        if (this.isLogged) {
          this.authService.getAuthenticatedId().subscribe({
            next: (response: { id: number }) =>
              (this.profileLink = `/user/${response.id}`),
            error: () => (this.profileLink = '/home'),
          });

          this.authService.getAuthenticatedRole().subscribe({
            next: (response: { role: string }) =>
              (this.isAdminOrEmployee =
                response.role === 'admin' || response.role === 'employee'),
            error: () => (this.isAdminOrEmployee = false),
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

  showReservationButton(): boolean {
    return this.isLogged && !this.isAdminOrEmployee;
  }

  toggleNavbar(): void {
    const navbar: HTMLElement = document.getElementById('navbarNav')!;
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  private openDialog(response: Message): void {
    this.openDialogService.success({
      title: response.message,
      goTo: '/home',
    } as SuccessDialogOptions);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response: Message) => this.openDialog(response),
    });
  }
}
