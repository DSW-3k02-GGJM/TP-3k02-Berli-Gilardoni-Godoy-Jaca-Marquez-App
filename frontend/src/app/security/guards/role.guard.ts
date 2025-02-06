// Angular
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// RxJS
import { catchError, map, of, switchMap } from 'rxjs';

// Services
import { AuthService } from '@security/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const allowedRoles: string[] | null = route.data['allowedRoles'];
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isAuthenticated().pipe(
    switchMap((isAuthenticated: boolean) => {
      if (allowedRoles === null) {
        if (!isAuthenticated) {
          return of(true);
        } else {
          router.navigate(['/home']);
          return of(false);
        }
      }

      if (!isAuthenticated) {
        router.navigate(['/login']);
        return of(false);
      }

      return authService.getAuthenticatedRole().pipe(
        map((response: { role: string }) => {
          if (response.role && allowedRoles.includes(response.role)) {
            return true;
          } else {
            router.navigate(['/home']);
            return false;
          }
        }),
        catchError(() => {
          router.navigate(['/home']);
          return of(false);
        })
      );
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
