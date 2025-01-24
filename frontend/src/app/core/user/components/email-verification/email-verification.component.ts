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

// Interfaces
import { Message } from '@shared/interfaces/message.interface';

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
  pending: boolean = true;
  image: string = '';
  message: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => this.verifyToken(params['token']),
    });
  }

  private verifyToken(token: string): void {
    this.authService.verifyEmailToken(token).subscribe({
      next: (response: Message) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: Message): void {
    this.image = 'checkmark';
    this.message = response.message;
    this.pending = false;
  }

  private handleError(error: HttpErrorResponse): void {
    this.image = 'wrongmark';
    this.message = error.error?.message;
    this.pending = false;
  }

  getImagePath(): string {
    return `assets/generic/${this.image}.png`;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
