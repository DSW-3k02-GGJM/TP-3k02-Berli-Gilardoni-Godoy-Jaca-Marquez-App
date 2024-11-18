import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";
import {catchError, map, of, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;
  const http = inject(HttpClient);

  const routeId = Number(route.paramMap.get('id'));

  return authService.getAuthenticatedId().pipe(
    switchMap((res) => {
      const authenticatedId = res.id;
      return authService.checkClient().pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          if (routeId === res.id) {
            return of(true);
          } else {
            console.log("ID de la ruta no coincide con el ID autenticado");
            router.navigate(['/home']);
            return of(false);
          }
        })
      );;
    }),
    catchError(() => {
      authService.notifyLoginOrLogout(false);
      console.log("No estás autenticado");
      router.navigate(['/login']);
      return of(false);
    })
  );
};
