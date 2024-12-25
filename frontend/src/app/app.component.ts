// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe({
      next: () => this.authService.notifyLoginOrLogout(true),
    });
  }
}
