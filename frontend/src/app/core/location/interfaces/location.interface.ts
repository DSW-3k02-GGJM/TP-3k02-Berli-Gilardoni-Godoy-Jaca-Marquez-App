// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { LocationInput } from '@core/location/interfaces/location-input.interface';

export interface Location extends BaseEntity, LocationInput {}
