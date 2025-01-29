// Interfaces
import { UsersResponse } from '@core/user/interfaces/users-response.interface';
import { LocationsResponse } from '@core/location/interfaces/locations-response.interface';

export interface ForkJoinAdminResponse extends ForkJoinUserResponse {
  userRole: { role: string };
  users: UsersResponse;
}

export interface ForkJoinUserResponse {
  imageServerUrl: { imageServerUrl: string };
  locations: LocationsResponse;
}
