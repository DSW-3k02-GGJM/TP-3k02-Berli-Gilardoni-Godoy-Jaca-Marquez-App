import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service.js';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit {
  role: string = 'Staff';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getAuthenticatedRole().subscribe(
      (response: any) => {
        if(response.role === 'admin') {
          this.role = 'Admin';
        } else if(response.role === 'employee') {
          this.role = 'Empleado';
        }
      }
    );
  }

}
