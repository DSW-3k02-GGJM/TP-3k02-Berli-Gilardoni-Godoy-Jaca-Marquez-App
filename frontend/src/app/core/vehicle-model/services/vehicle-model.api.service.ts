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
import { VehicleModelsResponse } from '@core/vehicle-model/interfaces/vehicle-models-response.interface';
import { VehicleModelResponse } from '@core/vehicle-model/interfaces/vehicle-model-response.interface';
import { VehicleModelInput } from '@core/vehicle-model/interfaces/vehicle-model-input.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class VehicleModelApiService {
  private readonly apiUrl = '/api/vehicle-models';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<VehicleModelsResponse> {
    return this.http.get<VehicleModelsResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<VehicleModelResponse> {
    return this.http.get<VehicleModelResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: VehicleModelInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: VehicleModelInput): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${id}`, data);
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
        `${this.apiUrl}/vehicle-model-name-exists/${name}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }
}
