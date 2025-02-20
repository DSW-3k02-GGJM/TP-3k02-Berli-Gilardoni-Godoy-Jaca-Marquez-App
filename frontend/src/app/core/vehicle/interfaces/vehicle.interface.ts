// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { VehicleInput } from '@core/vehicle/interfaces/vehicle-input.interface';

export interface Vehicle extends BaseEntity, VehicleInput {}
