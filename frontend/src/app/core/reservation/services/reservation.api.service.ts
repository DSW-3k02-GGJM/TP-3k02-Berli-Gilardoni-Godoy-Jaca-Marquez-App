// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';

// Interfaces
import { ReservationsResponse } from '@core/reservation/interfaces/reservations-response.interface';
import { ReservationInput } from '@core/reservation/interfaces/reservation-input.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationApiService {
  private readonly apiUrl = '/api/reservations';

  constructor(private readonly http: HttpClient) {}

  getAllByAdmin(): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(this.apiUrl);
  }

  getAllByUser(): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(
      `${this.apiUrl}/user-reservations`
    );
  }

  createByAdmin(data: ReservationInput): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/create-admin-reservation`,
      data
    );
  }

  createByUser(data: ReservationInput): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create-user-reservation`, data);
  }

  update(id: number, data: ReservationInput): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }
}
