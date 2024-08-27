import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from "../service/auth.service";
import {CommonModule} from "@angular/common";
import {catchError, map, Observable, of, Subscription,} from "rxjs";

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
  private subscription?: Subscription;


  ngOnInit() {
    console.log('ngOnInit');
    this.subscription = this.authService.loginOrLogout.subscribe(
      (isLogged: boolean) => {
        console.log('isLogged', isLogged);
        this.isAuthenticated = isLogged;
      }
    );

    if (this.authService.isLogged) {
      this.isAuthenticated = true;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    console.log(!this.isAuthenticated);
    this.authService.logout().subscribe(
      response => {
        this.authService.notifyLoginOrLogout();
        console.log(response);
      });
  }
}
