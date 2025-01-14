// Angular
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { catchError, delay, map, Observable, of } from 'rxjs';

// Interfaces
import { LocationsResponse } from '@core/location/interfaces/locations-response.interface';
import { LocationResponse } from '@core/location/interfaces/location-response.interface';
import { LocationInput } from '@core/location/interfaces/location-input.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private readonly apiUrl = '/api/locations';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<LocationsResponse> {
    return this.http.get<LocationsResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<LocationResponse> {
    return this.http.get<LocationResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: LocationInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: LocationInput): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }

  uniqueNameValidator(id: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.nameExists(control.value, id).pipe(
        map((exists: boolean) => (exists ? { nameExists: true } : null)),
        catchError(async () => of(null))
      );
    };
  }

  private nameExists(name: string, id: number): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(
        `${this.apiUrl}/location-name-exists/${name}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }
}
