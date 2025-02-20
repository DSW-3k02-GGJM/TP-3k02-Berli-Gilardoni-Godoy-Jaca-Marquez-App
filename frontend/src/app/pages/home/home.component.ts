// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomePageComponent {
  constructor(private readonly router: Router) {}

  navigateToReservation(): void {
    this.router.navigate(['/reservation']);
  }
}
