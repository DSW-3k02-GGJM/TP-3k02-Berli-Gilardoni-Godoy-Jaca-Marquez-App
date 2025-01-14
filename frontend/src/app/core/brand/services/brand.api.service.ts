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
import { BrandsResponse } from '@core/brand/interfaces/brands-response.interface';
import { BrandResponse } from '@core/brand/interfaces/brand-response.interface';
import { BrandInput } from '@core/brand/interfaces/brand-input.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandApiService {
  private readonly apiUrl = '/api/brands';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<BrandsResponse> {
    return this.http.get<BrandsResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: BrandInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: BrandInput): Observable<Message> {
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
        `${this.apiUrl}/brand-name-exists/${name}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }
}
