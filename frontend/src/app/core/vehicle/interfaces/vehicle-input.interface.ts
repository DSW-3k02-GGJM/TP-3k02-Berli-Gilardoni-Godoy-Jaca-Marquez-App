// Interfaces
import { Color } from '@core/color/interfaces/color.interface';
import { Location } from '@core/location/interfaces/location.interface';
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';

export interface VehicleInput {
  licensePlate: string;
  manufacturingYear: number;
  totalKms: number;
  color?: Color | number;
  location?: Location | number;
  vehicleModel?: VehicleModel;
}
