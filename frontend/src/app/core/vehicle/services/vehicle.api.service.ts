// Angular
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJS
import { catchError, delay, map, Observable, of } from 'rxjs';

// Interfaces
import { VehiclesResponse } from '@core/vehicle/interfaces/vehicles-response.interface';
import { VehicleResponse } from '@core/vehicle/interfaces/vehicle-response.interface';
import { VehicleInput } from '@core/vehicle/interfaces/vehicle-input.interface';
import { ReservationFilter } from '@core/reservation/interfaces/reservation-filter.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class VehicleApiService {
  private readonly apiUrl = '/api/vehicles';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<VehiclesResponse> {
    return this.http.get<VehiclesResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: VehicleInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: VehicleInput): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }

  uniqueLicensePlateValidator(id: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.licensePlateExists(control.value, id).pipe(
        map((exists: boolean) =>
          exists ? { licensePlateExists: true } : null
        ),
        catchError(async () => null)
      );
    };
  }

  private licensePlateExists(
    licensePlate: string,
    id: number
  ): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(
        `${this.apiUrl}/license-plate-exists/${licensePlate}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }

  private getStartDate(startDate: Date | string): string {
    return typeof startDate === 'string' ? startDate : '';
  }

  private getEndDate(endDate: Date | string): string {
    return typeof endDate === 'string' ? endDate : '';
  }

  findAvailableVehicles(
    filter: ReservationFilter
  ): Observable<VehiclesResponse> {
    const params = new HttpParams({
      fromObject: {
        startDate: this.getStartDate(filter.startDate),
        endDate: this.getEndDate(filter.endDate),
        location: filter.location,
      },
    });

    return this.http.get<VehiclesResponse>(`${this.apiUrl}/available`, {
      params,
    });
  }
}
