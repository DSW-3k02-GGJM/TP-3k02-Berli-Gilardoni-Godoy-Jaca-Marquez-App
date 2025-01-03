// Angular
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginOrLogout = new Subject<void>();
  isLogged = false;
  apiUrl = '/api';

  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  });

  findUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}`, data, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      withCredentials: true,
    });
  }

  createUser(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users`, data, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        tap(() => {}),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  register(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/register`, data, {
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          this.notifyLoginOrLogout(true);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/login`, data, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        tap(() => this.notifyLoginOrLogout(true)),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => this.notifyLoginOrLogout(false)),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  notifyLoginOrLogout(isLogged: boolean) {
    this.isLogged = isLogged;
    this.loginOrLogout.next();
  }

  isAuthenticated(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/is-authenticated`, {});
  }

  sendEmailVerification(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/send-email-verification/${email}`,
      {}
    );
  }

  sendPasswordReset(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/send-password-reset/${email}`,
      {}
    );
  }

  verifyPasswordResetToken(token: string, data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/verify-password-reset-token/${token}`, data, {
        headers: this.headers,
      })
      .pipe(delay(1000));
  }

  verifyEmailToken(token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/verify-email-token/${token}`,
      {}
    );
  }

  emailExists(email: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.apiUrl}/users/email-exists/${email}`)
      .pipe(
        delay(1000),
        map((response) => response.exists),
        catchError(() => of(false))
      );
  }

  uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.emailExists(control.value).pipe(
        map((exists) => (exists ? { emailExists: true } : null)),
        catchError(async () => null)
      );
    };
  }

  documentIDExists(documentID: string, id: number): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(
        `${this.apiUrl}/users/documentID-exists/${documentID}/${id}`
      )
      .pipe(
        delay(1000),
        map((response) => response.exists),
        catchError(() => of(false))
      );
  }

  uniqueDocumentIDValidator(id: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.documentIDExists(control.value, id).pipe(
        map((exists) => (exists ? { documentIDExists: true } : null)),
        catchError(async () => null)
      );
    };
  }

  maxDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? { maxDate: true } : null;
  }

  getAuthenticatedId(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/authenticated-id`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  checkAdmin(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/admin`, {
      withCredentials: true,
    });
  }

  checkEmployee(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/employee`, {
      withCredentials: true,
    });
  }

  checkClient(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/client`, {
      withCredentials: true,
    });
  }

  getAuthenticatedRole(): Observable<{ role: string }> {
    return this.http.post<{ role: string }>(
      `${this.apiUrl}/users/authenticated-role`,
      {},
      { withCredentials: true }
    );
  }
}
