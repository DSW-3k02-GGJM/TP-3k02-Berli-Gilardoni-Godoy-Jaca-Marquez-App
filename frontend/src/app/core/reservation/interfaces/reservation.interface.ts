// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { ReservationInput } from '@core/reservation/interfaces/reservation-input.interface';

export interface Reservation extends BaseEntity, ReservationInput {}
