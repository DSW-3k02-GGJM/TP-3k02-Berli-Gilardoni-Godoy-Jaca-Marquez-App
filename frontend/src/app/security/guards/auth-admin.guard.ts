// Angular
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// RxJS
import { catchError, map, of, switchMap } from 'rxjs';

// Services
import { AuthService } from '../../shared/services/auth/auth.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  return authService.isAuthenticated().pipe(
    switchMap(() => {
      return authService.checkAdmin().pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          router.navigate(['/home']);
          return of(false);
        })
      );
    }),
    catchError(() => {
      authService.notifyLoginOrLogout(false);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
