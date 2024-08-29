import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginOrLogout = new Subject<void>();
  isLogged = false;
  private apiUrl = '/api';

  notifyLoginOrLogout(isLogged : boolean) {
    this.isLogged = isLogged;
    this.loginOrLogout.next();
  }

  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  });

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/register`, data, {
      headers: this.headers,
    });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login`, data, {
      headers: this.headers,
      withCredentials: true,
    }).pipe(
      tap(() => this.notifyLoginOrLogout(true)), // login exitoso
      catchError(error => {
        // Error en el login
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/logout`, {
      withCredentials: true,
    }).pipe(
      tap(() => this.notifyLoginOrLogout(false)), // logout exitoso
      catchError(error => {
        // Error en el logout
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/is-authenticated`, {
      withCredentials: true,
    });
  }
}
