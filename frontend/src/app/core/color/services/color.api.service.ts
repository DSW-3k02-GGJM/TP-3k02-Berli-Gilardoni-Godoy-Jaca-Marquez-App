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
import { ColorsResponse } from '@core/color/interfaces/colors-response.interface';
import { ColorResponse } from '@core/color/interfaces/color-response.interface';
import { ColorInput } from '@core/color/interfaces/color-input.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ColorApiService {
  private readonly apiUrl = '/api/colors';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ColorsResponse> {
    return this.http.get<ColorsResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<ColorResponse> {
    return this.http.get<ColorResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: ColorInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: ColorInput): Observable<Message> {
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
        `${this.apiUrl}/color-name-exists/${name}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }
}
