import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponsiveNavbarComponent } from './responsive-navbar/responsive-navbar.component.js';
import { CommonModule } from '@angular/common';
import {catchError, map, of, tap, throwError} from "rxjs";
import {AuthService} from "./service/auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
  ) { }
  ngOnInit() {
    this.authService.isAuthenticated().subscribe(
      res=> {
        console.log("res");
        this.authService.notifyLoginOrLogout(true);
      }
    );
  }

  title = 'alquiler-vehiculos';
}
