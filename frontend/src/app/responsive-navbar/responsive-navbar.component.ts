import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from "../service/auth.service";
import {CommonModule} from "@angular/common";
import {catchError, map, Observable, of, } from "rxjs";

@Component({
  selector: 'app-responsive-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './responsive-navbar.component.html',
  styleUrl: './responsive-navbar.component.scss',
})
export class ResponsiveNavbarComponent implements OnInit {
  authService = inject(AuthService) as AuthService;
  isAuthenticated: boolean = false;

  ngOnInit() {
    // Suscribirse al Observable para actualizar isAuthenticated
    this.verifyAuthentication().subscribe(
      (isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      },
      (error: any) => {
        console.error('Error during authentication verification:', error);
        this.isAuthenticated = false;
      },
      () => {
        console.log('Authentication verification completed.');
      }
    );
  }

  verifyAuthentication(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(response => response.isAuthenticated), // Ajusta esto según la estructura de tu respuesta
      catchError(() => of(false))
    );
  }
  logout() {
    console.log(!this.isAuthenticated);
    this.authService.logout().subscribe(
      response => {
        console.log(response);
      });
  }
}
