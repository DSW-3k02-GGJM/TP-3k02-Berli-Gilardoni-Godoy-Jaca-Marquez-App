// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss',
})
export class EmailVerificationComponent implements OnInit {
  status = 'loading';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        const token = params['token'];
        setTimeout(() => {
          this.authService.verifyEmailToken(token).subscribe({
            next: () => {
              this.status = 'success';
            },
            error: (error) => {
              if (error.status === 401) {
                this.status = 'error';
              } else {
                this.status = 'commonError';
              }
            },
          });
        }, 2000);
      },
    });
  }
}
