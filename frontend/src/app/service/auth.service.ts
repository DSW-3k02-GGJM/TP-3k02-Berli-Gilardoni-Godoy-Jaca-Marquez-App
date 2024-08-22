import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
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
    });
  }

  isAuthenticated(): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/is-authenticated`, {
      withCredentials: true,
    });
  }
}
