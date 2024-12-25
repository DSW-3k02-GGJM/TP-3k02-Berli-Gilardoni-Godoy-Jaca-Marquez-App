// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';

// Services
import { AuthService } from '@shared/services/auth/auth.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Interfaces
import { MenuLink } from '@pages/staff/interfaces/menu-link.model';

@Component({
  selector: 'app-staff-menu',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './staff-menu.component.html',
  styleUrl: './staff-menu.component.scss',
})
export class StaffMenuComponent implements OnInit {
  role: string = 'Staff';
  baseLink: string = '/staff/';

  menuLinks: MenuLink[] = [
    { label: 'Usuarios', path: 'users', adminOnly: true },
    { label: 'Comunicación', path: 'comunication', adminOnly: false },
    { label: 'Categorías', path: 'categories', adminOnly: true },
    { label: 'Marcas', path: 'brands', adminOnly: true },
    { label: 'Colores', path: 'colors', adminOnly: true },
    { label: 'Sucursales', path: 'locations', adminOnly: true },
    { label: 'Modelos', path: 'vehicle-models', adminOnly: true },
    { label: 'Vehículos', path: 'vehicles', adminOnly: true },
    { label: 'Reservas', path: 'reservations', adminOnly: false },
  ];

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.authService.getAuthenticatedRole().subscribe({
      next: (response) =>
        (this.role = response.role === 'admin' ? 'Admin' : 'Empleado'),
      error: () => {
        this.snackBarService.show(
          'Error al obtener el rol del usuario autenticado'
        );
        this.role = 'Empleado';
      },
    });
  }

  canViewLink(link: MenuLink): boolean {
    return !link.adminOnly || this.role === 'Admin';
  }
}
