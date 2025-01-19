// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '@security/services/auth.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  templateUrl: './email-verification.component.html',
  styleUrls: [
    '../../../../shared/styles/generic-form.scss',
    './email-verification.component.scss',
  ],
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
})
export class EmailVerificationComponent implements OnInit {
  status: string = 'loading';

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        const token: string = params['token'];
        this.authService.verifyEmailToken(token).subscribe({
          next: () => {
            this.status = 'success';
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.status = 'error';
            } else {
              this.status = 'common-error';
            }
          },
        });
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
