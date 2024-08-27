import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loginOrLogout: Observable<boolean> = this.loggedInSubject.asObservable();
  isLogged = false;
  private apiUrl = '/api';

  get IsLogged(): boolean {
    return this.isLogged;
  }

  set IsLogged(value: boolean) {
    this.isLogged = value;
  }

  notifyLoginOrLogout() {
    this.loggedInSubject.next(this.isLogged);
  }

  resetIsLogged() {
    this.isLogged = false;
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
    this.isLogged = true;
    this.loggedInSubject.next(this.isLogged);
    return this.http.post(`${this.apiUrl}/usuarios/login`, data, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    this.isLogged = false;
    this.loggedInSubject.next(this.isLogged);
    return this.http.post(`${this.apiUrl}/usuarios/logout`, {
      withCredentials: true,
    });
  }

  isAuthenticated(): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/is-authenticated`, {
      withCredentials: true,
    });
  }
}
