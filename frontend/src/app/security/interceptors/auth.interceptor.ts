// Angular
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

// RxJS
import { catchError, tap, throwError } from 'rxjs';

// Services
import { AuthService } from '../../shared/services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService) as AuthService;
  return next(req).pipe(
    tap(() => {}),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.notifyLoginOrLogout(false);
        authService.logout().subscribe();
      }
      return throwError(() => error);
    })
  );
};
