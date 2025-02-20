// Interfaces
import { ColorsResponse } from '@core/color/interfaces/colors-response.interface';
import { LocationsResponse } from '@core/location/interfaces/locations-response.interface';
import { VehicleModelsResponse } from '@core/vehicle-model/interfaces/vehicle-models-response.interface';

export interface ForkJoinResponse {
  colors: ColorsResponse;
  locations: LocationsResponse;
  vehicleModels: VehicleModelsResponse;
}
