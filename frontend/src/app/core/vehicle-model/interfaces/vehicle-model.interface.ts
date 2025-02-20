// Interfaces
import { BaseEntity } from '@shared/interfaces/base-entity.interface';
import { VehicleModelInput } from '@core/vehicle-model/interfaces/vehicle-model-input.interface';

export interface VehicleModel extends BaseEntity, VehicleModelInput {}
