// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';

export interface ReservationsResponse {
  message: string;
  data: Reservation[];
}
