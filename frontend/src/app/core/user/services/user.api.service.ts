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
import { UsersResponse } from '@core/user/interfaces/users-response.interface';
import { UserResponse } from '@core/user/interfaces/user-response.interface';
import { UserInput } from '@core/user/interfaces/user-input.interface';
import { Message } from '@shared/interfaces/message.interface';
import { EmailData } from '../interfaces/email-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly apiUrl = '/api/users';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.apiUrl);
  }

  getOne(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: UserInput): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: UserInput): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }

  sendEmail(email: string, data: EmailData): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send-email/${email}`, data);
  }

  uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.emailExists(control.value).pipe(
        map((exists: boolean) => (exists ? { emailExists: true } : null)),
        catchError(async () => null)
      );
    };
  }

  private emailExists(email: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.apiUrl}/email-exists/${email}`)
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }

  uniqueDocumentIDValidator(id: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.documentIDExists(control.value, id).pipe(
        map((exists: boolean) => (exists ? { documentIDExists: true } : null)),
        catchError(async () => null)
      );
    };
  }

  private documentIDExists(
    documentID: string,
    id: number
  ): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(
        `${this.apiUrl}/document-id-exists/${documentID}/${id}`
      )
      .pipe(
        delay(500),
        map((response: { exists: boolean }) => response.exists),
        catchError(() => of(false))
      );
  }
}
