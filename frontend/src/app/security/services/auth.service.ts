// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RxJS
import {
  catchError,
  delay,
  map,
  Observable,
  of,
  Subject,
  tap,
  throwError,
} from 'rxjs';

// Interfaces
import { UserInput } from '@core/user/interfaces/user-input.interface';
import { LoginData } from '@core/user/interfaces/login-data.interface';
import { PasswordResetData } from '@core/user/interfaces/password-reset-data.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = '/api/users';

  loginOrLogout: Subject<void> = new Subject<void>();
  isLogged: boolean = false;

  constructor(private http: HttpClient) {}

  register(data: UserInput): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/login`, data).pipe(
      tap(() => this.notifyLoginOrLogout(true)),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.notifyLoginOrLogout(false)),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  notifyLoginOrLogout(isLogged: boolean): void {
    this.isLogged = isLogged;
    this.loginOrLogout.next();
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .post<{ authenticated: boolean }>(`${this.apiUrl}/is-authenticated`, {})
      .pipe(
        map((response: { authenticated: boolean }) => response.authenticated),
        catchError(() => of(false))
      );
  }

  getAuthenticatedId(): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      `${this.apiUrl}/authenticated-id`,
      {}
    );
  }

  getAuthenticatedRole(): Observable<{ role: string }> {
    return this.http.post<{ role: string }>(
      `${this.apiUrl}/authenticated-role`,
      {}
    );
  }

  sendEmailVerification(email: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/send-email-verification/${email}`,
      {}
    );
  }

  verifyEmailToken(token: string): Observable<Message> {
    return this.http
      .post<Message>(`${this.apiUrl}/verify-email-token/${token}`, {})
      .pipe(delay(500));
  }

  sendPasswordReset(email: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/send-password-reset/${email}`,
      {}
    );
  }

  verifyPasswordResetToken(
    token: string,
    data: PasswordResetData
  ): Observable<Message> {
    return this.http
      .post<Message>(
        `${this.apiUrl}/verify-password-reset-token/${token}`,
        data
      )
      .pipe(delay(500));
  }
}
