import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, of, Subject, tap, throwError} from 'rxjs';

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
    return this.http.post(`${this.apiUrl}/users/register`, data, {
      headers: this.headers,
    }).pipe(
      tap(() => {this.notifyLoginOrLogout(true);
      console.log("hola")}), // register exitoso
      catchError(error => {
        // Error en el register
        return throwError(() => error);
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, data, {
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
    return this.http.post(`${this.apiUrl}/users/logout`, {
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
    return this.http.post(`${this.apiUrl}/users/is-authenticated`, {
      withCredentials: true,
    })
  }
}
