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
  constructor(
    private authService: AuthService)
  { }
  isLogged = false;
  private subscription?: Subscription;


  ngOnInit() {
    console.log('ngOnInit');
    this.subscription =
      this.authService.loginOrLogout.subscribe(
        () => {
          this.isLogged = this.authService.isLogged;
        }
      );

    if(!this.authService.isLogged) {
      this.isLogged = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout()
      .subscribe(
      res => {
      console.log(res);
    });
  }
}
