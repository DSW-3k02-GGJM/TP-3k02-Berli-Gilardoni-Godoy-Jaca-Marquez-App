// Angular
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// RxJS
import { catchError, map, of, switchMap } from 'rxjs';

// Services
import { AuthService } from '../../shared/services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  const routeId = Number(route.paramMap.get('id'));

  return authService.getAuthenticatedId().pipe(
    switchMap((res) => {
      return authService.checkClient().pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          if (routeId === res.id) {
            return of(true);
          } else {
            console.log('Route ID does not match the authenticated ID');
            router.navigate(['/home']);
            return of(false);
          }
        })
      );
    }),
    catchError(() => {
      authService.notifyLoginOrLogout(false);
      console.log('You are not authenticated');
      router.navigate(['/login']);
      return of(false);
    })
  );
};
