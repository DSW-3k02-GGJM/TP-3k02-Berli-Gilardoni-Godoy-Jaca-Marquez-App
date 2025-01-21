// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';

export interface ReservationInput {
  reservationDate?: string;
  startDate?: string;
  plannedEndDate?: string;
  realEndDate?: string | null;
  cancellationDate?: string;
  initialKms?: number;
  finalKms?: number | null;
  finalPrice?: number | null;
  user?: User | number;
  vehicle?: Vehicle | number;
}
