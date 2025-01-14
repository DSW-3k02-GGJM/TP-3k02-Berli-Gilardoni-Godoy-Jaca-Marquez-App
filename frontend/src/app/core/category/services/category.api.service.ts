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
import { CategoriesResponse } from '@core/category/interfaces/categories-response.interface';
import { CategoryResponse } from '@core/category/interfaces/category-response.interface';
import { CategoryInput } from '@core/category/interfaces/category-input.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private readonly apiUrl = '/api/categories';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: CategoryInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: CategoryInput): Observable<Message> {
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
        `${this.apiUrl}/category-name-exists/${name}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }
}
