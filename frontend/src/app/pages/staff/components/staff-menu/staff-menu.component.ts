// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';

// Services
import { AuthService } from '@security/services/auth.service';

// Interfaces
import { MenuLink } from '@pages/staff/interfaces/menu-link.interface';

@Component({
  selector: 'app-staff-menu',
  standalone: true,
  templateUrl: './staff-menu.component.html',
  styleUrl: './staff-menu.component.scss',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
})
export class StaffMenuComponent implements OnInit {
  role: string = 'Staff';
  baseLink: string = '/staff/';

  menuLinks: MenuLink[] = [
    { label: 'Usuarios', path: 'users', adminOnly: true },
    { label: 'Comunicación', path: 'communication', adminOnly: false },
    { label: 'Marcas', path: 'brands', adminOnly: true },
    { label: 'Categorías', path: 'categories', adminOnly: true },
    { label: 'Colores', path: 'colors', adminOnly: true },
    { label: 'Sucursales', path: 'locations', adminOnly: true },
    { label: 'Modelos', path: 'vehicle-models', adminOnly: true },
    { label: 'Vehículos', path: 'vehicles', adminOnly: true },
    { label: 'Reservas', path: 'reservations', adminOnly: false },
  ];

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAuthenticatedRole().subscribe({
      next: (response: { role: string }) =>
        (this.role = response.role === 'admin' ? 'Admin' : 'Empleado'),
      error: () => (this.role = 'Empleado'),
    });
  }

  canViewLink(link: MenuLink): boolean {
    return !link.adminOnly || this.role === 'Admin';
  }

  toggleNavbar(): void {
    const navbar: HTMLElement = document.getElementById('navbarNavStaff')!;
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }
}
