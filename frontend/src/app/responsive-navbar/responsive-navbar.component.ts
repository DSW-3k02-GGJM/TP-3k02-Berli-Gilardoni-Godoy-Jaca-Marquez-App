import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-responsive-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './responsive-navbar.component.html',
  styleUrl: './responsive-navbar.component.scss',
})
export class ResponsiveNavbarComponent {}
