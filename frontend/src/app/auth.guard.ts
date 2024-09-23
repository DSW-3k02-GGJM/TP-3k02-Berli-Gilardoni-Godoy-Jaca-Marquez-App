import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./service/auth.service";
import {catchError, map, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;
  const http = inject(HttpClient);

  return authService.isAuthenticated().pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      authService.notifyLoginOrLogout(false);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
