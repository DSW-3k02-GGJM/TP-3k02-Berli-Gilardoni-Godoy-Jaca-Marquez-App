import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, delay, map, Observable, of, Subject, tap, throwError} from 'rxjs';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

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
      headers: this.headers,
      withCredentials: true,
    });
  }


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

  emailExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/users/email-exists/${email}`)
      .pipe(
        delay(1000),
        map(response => response.exists),
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

  documentIDExists(documentID: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/users/documentID-exists/${documentID}`)
      .pipe(
        delay(1000),
        map(response => response.exists),
        catchError(() => of(false)) 
      );
  }
  
  uniqueDocumentIDValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.documentIDExists(control.value).pipe(
        map((exists) => (exists ? { documentIDExists: true } : null)),
        catchError(async () => null)
      );
    };
  }

  maxDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora para comparar solo la fecha

    return selectedDate > today ? { maxDate: true } : null;
  }

  getAuthenticatedId(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/authenticated-id`, {
      headers: this.headers,
      withCredentials: true,
    })
  }

  checkAdmin(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/admin`, {
      withCredentials: true,
    })
  }

  checkEmployee(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/employee`, {
      withCredentials: true,
    })
  }

  checkClient(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/client`, {
      withCredentials: true,
    })
  }
}
