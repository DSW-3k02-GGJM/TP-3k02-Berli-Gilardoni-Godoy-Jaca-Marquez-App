// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';

export interface ReservationInput {
  reservationDate: string;
  startDate: string;
  plannedEndDate: string;
  realEndDate?: string;
  cancellationDate?: string;
  initialKms?: number;
  finalKms?: number;
  calculatedPrice?: string;
  user?: User | number;
  vehicle: Vehicle | number;
}
