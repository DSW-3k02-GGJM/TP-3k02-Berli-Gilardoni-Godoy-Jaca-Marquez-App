import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService) as AuthService;
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Notificar al AuthService que la sesión ha expirado
        authService.notifyLoginOrLogout(false);
        authService.logout().subscribe();
      }
      return throwError(() => error);
    })
  );;
};
