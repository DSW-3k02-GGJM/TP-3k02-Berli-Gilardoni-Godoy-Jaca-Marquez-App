import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, delay, map, Observable, of } from 'rxjs';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /*
  getAvailableVehicleModelsHandler(fechaDesde: string, fechaHasta: string) {
    throw new Error('Method not implemented.');
  }
  */

  private apiUrl = '/api';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  });

  httpClient: any;

  constructor(private http: HttpClient) {}

  createAdminReservation(resData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reservations/createAdminReservation`,
      resData
    );
  }

  createUserReservation(resData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reservations/createUserReservation`,
      resData
    );
  }

  getAll(entity: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  getOne(entity: string, id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}/${id}`, {
      withCredentials: true,
    });
  }

  create(entity: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/${entity}`, data, {
      headers: headers,
      withCredentials: true,
    });
  }

  update(entity: string, id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.apiUrl}/${entity}/${id}`, data, {
      headers: headers,
      withCredentials: true,
    });
  }

  delete(entity: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${entity}/${id}`, {
      withCredentials: true,
    });
  }

  sendEmail(resData: any, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/send-email/${email}`, resData, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  getReservationsByUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservations/user-reservations`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  entityNameExists(
    entity: string,
    entityName: string,
    id: number
  ): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(
        `${this.apiUrl}/${entity}/entityName-exists/${entityName}/${id}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        delay(1000),
        map((response) => response.exists),
        catchError(() => of(false))
      );
  }

  uniqueEntityNameValidator(entity: string, id: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.entityNameExists(entity, control.value, id).pipe(
        map((exists) => (exists ? { entityNameExists: true } : null)),
        catchError(async () => null)
      );
    };
  }
}
