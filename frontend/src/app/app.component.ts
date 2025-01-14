// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '@security/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (isAuthenticated: boolean) =>
        this.authService.notifyLoginOrLogout(isAuthenticated),
    });
  }
}
