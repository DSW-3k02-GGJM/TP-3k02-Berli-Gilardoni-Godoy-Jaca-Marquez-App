import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service.js';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';

export const authClientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;
  const http = inject(HttpClient);

  return authService.isAuthenticated().pipe(
    switchMap(() => {
      return authService.checkClient().pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          router.navigate(['/login']);
          return of(false);
        })
      );;
    }),
    catchError(() => {
      authService.notifyLoginOrLogout(false);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
